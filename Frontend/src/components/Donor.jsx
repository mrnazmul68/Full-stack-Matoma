import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteContent } from './SiteContentProvider';
import { UPAZILAS } from '../utils/upazilaData';

const Donor = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [upozila, setUpozila] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { siteContent } = useSiteContent();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/donors?bloodGroup=${encodeURIComponent(bloodGroup)}&upozila=${encodeURIComponent(upozila)}`);
  };

  const filteredUpazilas = UPAZILAS.filter(u => 
    u.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectUpazila = (u) => {
    setUpozila(u);
    setSearchTerm(u);
    setShowDropdown(false);
  };

  return (
    <section
      id="donor"
      className="flex h-auto w-full flex-col items-center justify-center bg-black py-12 text-white sm:py-16"
    >
      <div className="mb-10 flex w-full flex-col items-center justify-center px-4 text-center">
        <h2 className="w-full text-[20px] font-extrabold uppercase tracking-[0.24em] text-[tomato] md:text-[30px]">
          {siteContent.donor.title}
        </h2>
        <p className="mt-4 max-w-[720px] text-[14px] leading-7 text-[#d1d1d1] md:text-[16px]">
          {siteContent.donor.subtitle}
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-12 flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border border-red-900/50 bg-[#0b0a0abf] p-5 shadow-[0_0_30px_rgba(255,0,0,0.2)] backdrop-blur-md sm:p-7 md:p-10"
      >
        <div className="flex flex-col w-full">
          <label className="text-white mb-2 text-sm uppercase tracking-widest font-bold">Blood Group</label>
          <select 
            value={bloodGroup} 
            onChange={(e) => setBloodGroup(e.target.value)}
            className="bg-black/50 text-white border border-red-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all appearance-none cursor-pointer"
          >
            <option value="" className="bg-black">Select Group</option>
            <option value="A+" className="bg-black">A+</option>
            <option value="A-" className="bg-black">A-</option>
            <option value="B+" className="bg-black">B+</option>
            <option value="B-" className="bg-black">B-</option>
            <option value="AB+" className="bg-black">AB+</option>
            <option value="AB-" className="bg-black">AB-</option>
            <option value="O+" className="bg-black">O+</option>
            <option value="O-" className="bg-black">O-</option>
          </select>
        </div>

        <div className="relative flex w-full flex-col" ref={dropdownRef}>
          <label className="text-white mb-2 text-sm uppercase tracking-widest font-bold">Location</label>
          <input 
            type="text" 
            placeholder="Search Upazila..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
              if (e.target.value === '') setUpozila('');
            }}
            onFocus={() => setShowDropdown(true)}
            className="bg-black/50 text-white border-1 border-red-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all placeholder:text-gray-600"
          />
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full z-[1001] mt-2 max-h-[250px] overflow-y-auto rounded-xl border-2 border-red-900/50 bg-black shadow-2xl backdrop-blur-md">
              {filteredUpazilas.length > 0 ? (
                filteredUpazilas.map((u, i) => (
                  <div 
                    key={i} 
                    onClick={() => selectUpazila(u)}
                    className="px-4 py-3 hover:bg-red-600/20 cursor-pointer text-white border-b border-gray-800/30 transition-colors"
                  >
                    {u}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500">No Upazila found</div>
              )}
            </div>
          )}
        </div>

        <div className="flex w-full items-end pt-2 sm:pt-4">
          <button 
            type="submit"
            className="w-full rounded-xl border-2 border-red-600 bg-red-600 px-6 py-3.5 font-black uppercase tracking-[0.18em] text-white transition-all duration-500 hover:scale-[1.02] hover:bg-black hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]"
          >
            {siteContent.donor.buttonLabel}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Donor;
