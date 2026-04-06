import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import Header from '../components/Header';
import { donorService } from '../services/donorService';

const DonorsResults = () => {
  const [searchParams] = useSearchParams();
  const bloodGroup = searchParams.get('bloodGroup') || '';
  const upozila = searchParams.get('upozila') || '';

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDonors = async () => {
      try {
        setIsLoading(true);
        setError('');
        const filtered = await donorService.searchDonors(bloodGroup, upozila);
        setResults(filtered);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDonors();
  }, [bloodGroup, upozila]);

  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      <Header activeSection="donor" />

      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <Link
            to="/"
            className="group inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-gray-400 no-underline transition-all duration-300 hover:text-[tomato]"
          >
            <AiOutlineArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="max-w-2xl text-left lg:text-right">
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-black uppercase tracking-[0.18em] text-[tomato]">
              Search Results
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-400 sm:text-base">
              Showing results for <span className="font-bold text-white">{bloodGroup || 'Any'}</span>{' '}
              in <span className="font-bold text-white">{upozila || 'Any'}</span>
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {isLoading ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-[32px] border border-dashed border-red-900/30 bg-[#0b0a0abf] px-6 py-20 text-center">
              <h3 className="text-2xl font-black uppercase tracking-[0.24em] text-white/30 sm:text-4xl">
                Loading donors...
              </h3>
            </div>
          ) : error ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-[32px] border border-dashed border-red-900/30 bg-[#0b0a0abf] px-6 py-20 text-center">
              <h3 className="text-2xl font-black uppercase tracking-[0.24em] text-white/20 sm:text-4xl">
                Unable to load donors
              </h3>
              <p className="mt-4 max-w-xl text-center text-sm leading-7 text-gray-500 sm:text-base">
                {error}
              </p>
            </div>
          ) : results.length > 0 ? (
            results.map((donor, index) => (
              <article
                key={index}
                className="group flex h-full flex-col rounded-[30px] border border-solid border-red-900/30 bg-[#0b0a0abf] p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,0,0,0.2)] sm:p-6"
              >
                <div className="relative mb-6 mx-auto h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36">
                  <div className="h-full w-full overflow-hidden rounded-full border-2 border-red-900/30 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
                    <img
                      src={donor.photo}
                      alt={donor.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute right-1 top-1 z-10 rounded-full border-2 border-black bg-red-600 px-2.5 py-1 text-[12px] tracking-tighter text-white shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                    {donor.bloodGroup}
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-red-500">
                    Verified Donor
                  </span>
                  <h3 className="mt-2 text-xl tracking-tight text-white transition-colors group-hover:text-[tomato]">
                    {donor.name}
                  </h3>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Age</span>
                      <span className="text-gray-300">{donor.age} Years</span>
                    </div>
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">
                        Upazila
                      </span>
                      <span className="text-right text-gray-300">{donor.upozila}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">
                        Number
                      </span>
                      <span className="text-right text-gray-300">{donor.mobile}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-8 w-full rounded-xl border-2 border-red-600 bg-transparent py-3 text-sm uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_20px_rgba(255,0,0,0.4)]"
                    onClick={() =>
                      window.open(
                        `https://wa.me/88${donor.mobile.replace(/\*/g, '')}?text=Assalamu%20alaikum%2C%20ami%20aapnar%20donation%20niye%20book%20korte%20chai.`,
                      )
                    }
                  >
                    Book Now
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-[32px] border border-dashed border-red-900/30 bg-[#0b0a0abf] px-6 py-20 text-center">
              <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[tomato]/25 bg-[rgba(255,99,71,0.08)] text-[tomato]">
                <FiSearch size={28} />
              </span>
              <h3 className="text-2xl font-black uppercase tracking-[0.24em] text-white/20 sm:text-4xl">
                No donor found
              </h3>
              <p className="mt-4 max-w-xl text-center text-sm leading-7 text-gray-500 sm:text-base">
                Try searching with a different blood group or location.
              </p>
              <Link
                to="/"
                className="mt-8 rounded-full border-2 border-red-600 bg-red-600 px-8 py-3 text-sm font-bold uppercase tracking-[0.22em] text-white no-underline transition-all hover:bg-black"
              >
                Search Again
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorsResults;
