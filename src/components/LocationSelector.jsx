import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, ChevronDown, Loader2 } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

// Simple external CSS applied inline or added later
const LocationSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetLocation, setTargetLocation] = useState('Bangalore'); // Default

  const modalRef = useRef(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Debounced Search API
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        let endpoint = '';
        // If it's a 6 digit number, assume pincode
        if (/^\d{6}$/.test(searchQuery)) {
          endpoint = `https://api.postalpincode.in/pincode/${searchQuery}`;
        } else {
          // Otherwise, search by city/post office name
          endpoint = `https://api.postalpincode.in/postoffice/${searchQuery}`;
        }

        const res = await fetch(endpoint);
        const data = await res.json();

        // The API returns an array, first element contains the status and PostOffice details
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice) {
          // Remove duplicates based on District/State to keep list clean
          const uniqueLocations = [];
          const seen = new Set();
          
          data[0].PostOffice.forEach(po => {
            const id = `${po.District}-${po.State}`;
            if (!seen.has(id)) {
              seen.add(id);
              uniqueLocations.push({
                name: po.Name,
                district: po.District,
                state: po.State,
                pincode: po.Pincode
              });
            }
          });
          
          setResults(uniqueLocations.slice(0, 8)); // Top 8 results
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Failed to fetch location", err);
        setResults([]);
      }
      setLoading(false);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelect = (loc) => {
    // Format: "City, PIN"
    setTargetLocation(`${loc.district}, ${loc.pincode}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="location-selector-container" style={{ position: 'relative' }}>
      
      {/* The Trigger Button */}
      <div 
        className="nav-location" 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#f0f4f8',
          padding: '0.6rem 1rem',
          borderRadius: '6px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          border: '1px solid #ebebeb',
          minWidth: '150px'
        }}
      >
        <MapPin size={18} color="#004ba3" />
        <span style={{flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px'}}>
          {targetLocation}
        </span>
        <ChevronDown size={16} color="#666" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>

      {/* The Dropdown Modal */}
      {isOpen && (
        <div 
          ref={modalRef}
          style={{
            position: 'absolute',
            top: '120%',
            left: 0,
            width: '320px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '1px solid #ebebeb',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Search Input Box */}
          <div style={{ padding: '1rem', borderBottom: '1px solid #ebebeb', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fafafa' }}>
            <Search size={18} color="#888" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search City or Pincode..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.95rem'
              }}
            />
            {loading && <Loader2 size={16} color="#004ba3" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
          </div>

          {/* Results List */}
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {searchQuery.length < 3 && !loading ? (
              <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                Type at least 3 characters to search across 19,000+ Indian Pin Codes.
              </div>
            ) : results.length > 0 ? (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {results.map((loc, idx) => (
                  <li 
                    key={idx}
                    onClick={() => handleSelect(loc)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f0f4f8'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <MapPin size={18} color="#888" style={{ marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: '600', color: '#333', fontSize: '0.95rem' }}>{loc.district}</div>
                      <div style={{ fontSize: '0.8rem', color: '#777' }}>{loc.state} - {loc.pincode}</div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : searchQuery.length >= 3 && !loading ? (
              <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                No locations found. Try a valid city or 6-digit pin.
              </div>
            ) : null}
          </div>

          <style>
            {`
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
