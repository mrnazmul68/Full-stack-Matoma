import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineCamera } from 'react-icons/ai';
import { useSiteContent } from '../components/SiteContentProvider';
import { useToast } from '../components/ToastProvider';
import { UPAZILAS } from '../utils/upazilaData';
import { donorService } from '../services/donorService';
import { authService } from '../services/authService';
import {
  getIncompleteProfileMessage,
  isProfileComplete,
} from '../utils/profileCompletion';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    photo: null,
    name: '',
    email: '',
    isDonor: '',
    upozila: '',
    mobile: '',
    bloodGroup: '',
    age: '',
    donated: false,
    lastDonationDate: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { siteContent } = useSiteContent();
  const toast = useToast();
  const profileIsComplete = isProfileComplete(profileData);
  const shouldLockProfile = isProfileLoaded && !profileIsComplete;
  const profileBlockMessage = getIncompleteProfileMessage(profileData);

  const normalizeProfile = (user) => ({
    photo: user.photo || null,
    name: user.name || '',
    email: user.email || '',
    isDonor: user.isDonor || '',
    upozila: user.upozila || '',
    mobile: user.mobile || '',
    bloodGroup: user.bloodGroup || '',
    age: user.age || '',
    donated: Boolean(user.donated),
    lastDonationDate: user.lastDonationDate || null,
  });

  const persistProfile = async (nextProfile, options = {}) => {
    const { successMessage = '', redirectToHome = false } = options;
    const savedUser = await authService.getSession();

    if (!savedUser?.id) {
      throw new Error('Please log in again before saving your profile.');
    }

    const updatedProfile = await donorService.saveProfile(savedUser.id, {
      ...nextProfile,
      photo: nextProfile.photo || siteContent.brand.logo,
    });

    authService.setCachedSession(updatedProfile);
    setProfileData(normalizeProfile(updatedProfile));
    setSearchTerm(updatedProfile.upozila || '');

    if (successMessage) {
      toast.success(successMessage);
    }

    if (redirectToHome) {
      navigate('/');
    }

    return updatedProfile;
  };

  useEffect(() => {
    const loadProfile = async () => {
      const savedUser = await authService.getSession();

      if (!savedUser) {
        toast.info('Please log in to access your profile.');
        navigate('/login');
        return;
      }
      const user = savedUser;

      if (!user.id) {
        setProfileData(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
        }));
        return;
      }

      try {
        const existingProfile = await donorService.getProfile(user.id);
        authService.setCachedSession(existingProfile, { notify: false });
        setProfileData(normalizeProfile(existingProfile));
        setSearchTerm(existingProfile.upozila || '');
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsProfileLoaded(true);
      }
    };

    loadProfile();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!shouldLockProfile) {
      return undefined;
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldLockProfile]);

  const handleChange = (e) => {
    const { name, id, value } = e.target;
    const key = name || id;
    const nextProfile = { ...profileData, [key]: value };

    if (key === 'isDonor' && value === 'non-donor') {
      const nonDonorProfile = {
        ...nextProfile,
        upozila: '',
        mobile: '',
        bloodGroup: '',
        age: '',
        donated: false,
        lastDonationDate: null,
      };

      setProfileData(nonDonorProfile);
      setSearchTerm('');
      setIsSaving(true);

      persistProfile(nonDonorProfile, {
        successMessage: 'You are now hidden from donor search.',
      })
        .catch((error) => toast.error(error.message))
        .finally(() => setIsSaving(false));

      return;
    }

    setProfileData(nextProfile);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData({ ...profileData, photo: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredUpazilas = UPAZILAS.filter(u => 
    u.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectUpazila = (u) => {
    setProfileData({ ...profileData, upozila: u });
    setSearchTerm(u);
    setShowDropdown(false);
  };

  const getDaysRemaining = () => {
    if (!profileData.lastDonationDate) return 0;
    const donationDate = new Date(profileData.lastDonationDate);
    const today = new Date();
    const diffTime = today - donationDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const remaining = 90 - diffDays;
    return remaining > 0 ? remaining : 0;
  };

  const toggleDonated = async () => {
    const nextProfile = {
      ...profileData,
      donated: !profileData.donated,
      lastDonationDate: !profileData.donated ? new Date().toISOString() : null,
    };

    setProfileData(nextProfile);
    setIsSaving(true);

    try {
      await persistProfile(nextProfile, {
        successMessage: nextProfile.donated
          ? 'Marked as donated. You are hidden from donor search now.'
          : 'You are available in donor search again.',
      });
    } catch (error) {
      toast.error(error.message);
      setProfileData(profileData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const savedUser = await authService.getSession();

    if (!savedUser?.id) {
      toast.error('Please log in again before saving your profile.');
      navigate('/login');
      return;
    }
    
    // Ensure donor status is selected
    if (!profileData.isDonor) {
      toast.error('Please select your Donor Status (Role) before saving.');
      return;
    }
    
    // Validate if donor
    if (profileData.isDonor === 'donor') {
      if (!profileData.name || !profileData.bloodGroup || !profileData.upozila || !profileData.mobile || !profileData.age) {
        toast.error('Please fill in all mandatory donor fields (Name, Blood Group, Upazila, Mobile, Age).');
        return;
      }

    }

    try {
      setIsSaving(true);

      await persistProfile(profileData, {
        successMessage: 'Profile saved successfully.',
        redirectToHome: true,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToHome = () => {
    if (!isProfileLoaded || shouldLockProfile) {
      toast.info(profileBlockMessage);
      return;
    }

    navigate('/');
  };

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-black px-4 py-6 sm:py-8">
      <div className="relative w-full max-w-2xl space-y-6 rounded-[35px] border border-red-900/50 bg-[#0b0a0abf] p-5 pt-20 shadow-[0_0_40px_rgba(255,0,0,0.15)] backdrop-blur-md sm:p-6 sm:pt-20 md:p-8 md:pt-20">
        
        <div className="absolute left-5 top-5 flex items-center gap-4 sm:left-6 sm:top-6">
          <button
            type="button"
            onClick={handleBackToHome}
            className={`p-2 transition-colors ${
              isProfileLoaded && !shouldLockProfile
                ? 'text-gray-500 hover:text-[tomato]'
                : 'cursor-not-allowed text-gray-700'
            }`}
            aria-label="Back to Home"
          >
            <AiOutlineArrowLeft size={22} />
          </button>
        </div>

        {profileData.isDonor === 'donor' && (
          <div className="absolute right-5 top-5 flex flex-col items-end gap-2 sm:right-6 sm:top-6">
            <button
              type="button"
              onClick={toggleDonated}
              className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 font-bold uppercase text-[10px] tracking-widest ${
                profileData.donated 
                  ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(255,0,0,0.3)]' 
                  : 'bg-black/50 border-red-900/30 text-gray-500 hover:border-red-600/50'
              }`}
            >
              {profileData.donated ? 'Donated' : 'Mark as Donated'}
            </button>
            {profileData.donated && (
              <div className="bg-red-600/10 text-red-500 text-[10px] font-black px-3 py-1.5 rounded-lg border border-red-600/20 tracking-widest uppercase">
                {getDaysRemaining()} Days Left
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <img
            className="mx-auto mb-2 h-10 w-10 rounded-full border border-[tomato]/30 object-cover"
            src={siteContent.brand.logo}
            alt={`${siteContent.brand.siteName} logo`}
          />
          <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white leading-tight">Your Profile</h2>
          <p className="text-gray-500 text-[11px] mt-1">Manage your information</p>
          {shouldLockProfile && (
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[tomato]">
              {profileBlockMessage}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center">
            <div 
              className="relative w-24 h-24 rounded-full border-4 border-red-600/30 overflow-hidden group cursor-pointer shadow-[0_0_20px_rgba(255,0,0,0.2)]"
              onClick={() => fileInputRef.current.click()}
            >
              {profileData.photo ? (
                <img src={profileData.photo} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full bg-red-950/20 flex items-center justify-center text-red-500">
                  <AiOutlineCamera size={30} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-[10px] font-bold uppercase tracking-widest text-center px-2">Change Photo</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] mb-1.5 ml-1">Full Name</label>
              <input 
                id="name"
                type="text" 
                value={profileData.name}
                onChange={handleChange}
                className="bg-black/50 text-white border-2 border-red-900/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-600 transition-all text-sm placeholder:text-gray-800"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] mb-1.5 ml-1">Email Address</label>
              <input 
                id="email"
                type="email" 
                value={profileData.email}
                readOnly
                className="bg-black/30 text-gray-500 border-2 border-red-900/10 rounded-xl px-4 py-2.5 focus:outline-none text-sm cursor-not-allowed"
              />
            </div>

            {/* Donor Status Selection */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] mb-1.5 ml-1">Donor Status</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <select 
                  id="isDonor"
                  name="isDonor"
                  value={profileData.isDonor}
                  onChange={handleChange}
                  className="flex-1 bg-black/50 text-white border-2 border-red-900/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-600 transition-all appearance-none cursor-pointer text-sm"
                >
                  <option value="" disabled className="bg-black text-gray-600">Select Role</option>
                  <option value="donor" className="bg-black">Donor</option>
                  <option value="non-donor" className="bg-black">Non-Donor</option>
                </select>
              </div>
            </div>

            {/* Mobile */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] mb-1.5 ml-1">Mobile {profileData.isDonor === 'donor' && <span className="text-red-600">*</span>}</label>
              <input 
                id="mobile"
                type="text" 
                placeholder="01xxxxxxxxx"
                value={profileData.mobile}
                onChange={handleChange}
                required={profileData.isDonor === 'donor'}
                className="bg-black/50 text-white border-2 border-red-900/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-600 transition-all text-sm placeholder:text-gray-800"
              />
            </div>

            {/* Age */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] mb-1.5 ml-1">Age {profileData.isDonor === 'donor' && <span className="text-red-600">*</span>}</label>
              <input 
                id="age"
                type="number" 
                placeholder="Years"
                value={profileData.age}
                onChange={handleChange}
                required={profileData.isDonor === 'donor'}
                className="bg-black/50 text-white border-2 border-red-900/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-600 transition-all text-sm placeholder:text-gray-800"
              />
            </div>

            {/* Blood Group */}
            <div className="flex flex-col">
              <label className="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] mb-1.5 ml-1">Blood {profileData.isDonor === 'donor' && <span className="text-red-600">*</span>}</label>
              <select 
                id="bloodGroup"
                name="bloodGroup"
                value={profileData.bloodGroup}
                onChange={handleChange}
                required={profileData.isDonor === 'donor'}
                className="bg-black/50 text-white border-2 border-red-900/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-600 transition-all appearance-none cursor-pointer text-sm"
              >
                <option value="" className="bg-black">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                  <option key={group} value={group} className="bg-black">{group}</option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div className="flex flex-col relative" ref={dropdownRef}>
              <label className="text-gray-500 text-[9px] uppercase font-black tracking-[0.2em] mb-1.5 ml-1">Upazila {profileData.isDonor === 'donor' && <span className="text-red-600">*</span>}</label>
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                  if (e.target.value === '') setProfileData({ ...profileData, upozila: '' });
                }}
                onFocus={() => setShowDropdown(true)}
                required={profileData.isDonor === 'donor'}
                className="bg-black/50 text-white border-2 border-red-900/30 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-600 transition-all text-sm placeholder:text-gray-800"
              />
              {showDropdown && (
                <div className="absolute left-0 right-0 top-full z-[1001] mt-2 max-h-[150px] overflow-y-auto rounded-xl border-2 border-red-900/50 bg-black shadow-2xl backdrop-blur-xl">
                  {filteredUpazilas.length > 0 ? (
                    filteredUpazilas.map((u, i) => (
                      <div 
                        key={i} 
                        onClick={() => selectUpazila(u)}
                        className="px-4 py-2 hover:bg-red-600/20 cursor-pointer text-white border-b border-gray-800/30 transition-colors text-xs"
                      >
                        {u}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-600 text-[10px] italic">No location found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSaving}
            className="w-full bg-red-600 text-white font-black uppercase tracking-[0.3em] py-3 rounded-xl hover:bg-black border-2 border-red-600 transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)] text-sm"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        {profileData.isDonor === 'non-donor' && isProfileLoaded && profileIsComplete && (
          <div className="pt-6 border-t border-gray-900/50 text-center">
            <button
              type="button"
              onClick={handleBackToHome}
              className="text-gray-600 hover:text-[tomato] transition-colors text-[10px] uppercase font-bold tracking-widest"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
