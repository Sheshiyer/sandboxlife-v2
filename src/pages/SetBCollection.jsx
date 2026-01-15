import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { iconsv2_questions } from '../constants/questions';
import TopBar from '../components/TopBar';
import Menu from '../components/Menu';
import { Squares2X2Icon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import Breadcrumb from "../components/Breadcrumb";

export default function SetBCollection() {
  const { userId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'
  const [selectedIcon, setSelectedIcon] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleIconClick = (icon) => {
    setSelectedIcon(selectedIcon?.uuid === icon.uuid ? null : icon);
  };

  return (
    <div className="min-h-screen bg-bgpapyrus flex flex-col">
      {/* Header */}
      <TopBar toggleMenu={toggleMenu} />

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <Menu toggleMenu={toggleMenu} />
        </div>
      )}

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Dashboard", to: `/home/${userId}` },
          { label: "Library" },
          { label: "Collections" },
          { label: "Set B (Preview)" },
        ]}
      />

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="bg-lightpapyrus rounded-3xl border border-darkpapyrus shadow-sm p-6 md:p-8">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-center text-slate-900 mb-6">
              Set B Icon Collection
            </h1>

            {/* Preview Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8">
              <p className="text-center text-amber-800 text-sm md:text-base">
                <span className="mr-2">🔍</span>
                Preview Only - These icons are not yet available for journaling
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-bgpapyrus rounded-2xl p-1 border border-darkpapyrus">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-lightpapyrus text-slate-900 shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                  Grid View
                </button>
                <button
                  onClick={() => setViewMode('carousel')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    viewMode === 'carousel'
                      ? 'bg-lightpapyrus text-slate-900 shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <ViewColumnsIcon className="w-4 h-4" />
                  Carousel View
                </button>
              </div>
            </div>

            {/* Icons Grid */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {iconsv2_questions.map((icon) => (
                  <button
                    key={icon.uuid}
                    onClick={() => handleIconClick(icon)}
                    className={`group flex flex-col items-center p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedIcon?.uuid === icon.uuid
                        ? 'border-red bg-red/5 shadow-md'
                        : 'border-darkpapyrus bg-bgpapyrus hover:border-red/50'
                    }`}
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-2xl overflow-hidden bg-bgpapyrus">
                      <img
                        src={icon.icon}
                        alt={icon.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 text-center">
                      {icon.name}
                    </h3>
                    <p className="text-xs text-slate-600 text-center mt-1 leading-tight">
                      {icon.meaning}
                    </p>
                    {selectedIcon?.uuid === icon.uuid && (
                      <span className="mt-2 text-xs font-medium text-red">
                        Selected
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* Carousel View */
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max px-4">
                  {iconsv2_questions.map((icon) => (
                    <button
                      key={icon.uuid}
                      onClick={() => handleIconClick(icon)}
                      className={`flex-shrink-0 flex flex-col items-center p-6 rounded-xl border-2 transition-all w-40 ${
                        selectedIcon?.uuid === icon.uuid
                        ? 'border-red bg-red/5 shadow-md'
                        : 'border-darkpapyrus bg-bgpapyrus hover:border-red/50 hover:shadow-md'
                      }`}
                    >
                      <div className="w-24 h-24 mb-4 rounded-2xl overflow-hidden bg-bgpapyrus">
                        <img
                          src={icon.icon}
                          alt={icon.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900 text-center">
                        {icon.name}
                      </h3>
                      <p className="text-xs text-slate-600 text-center mt-1">
                        {icon.meaning}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Icon Detail */}
            {selectedIcon && (
              <div className="mt-8 p-6 bg-bgpapyrus rounded-2xl border border-darkpapyrus">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-lightpapyrus border border-darkpapyrus flex-shrink-0">
                    <img
                      src={selectedIcon.icon}
                      alt={selectedIcon.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold text-slate-900">
                      {selectedIcon.name}
                    </h3>
                    <p className="text-red font-medium mt-1">
                      {selectedIcon.meaning}
                    </p>
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-slate-700 mb-2">
                        Trigger Questions:
                      </p>
                      <ul className="space-y-2">
                        {selectedIcon.trigger_question.map((q, idx) => (
                          <li key={idx} className="text-sm text-slate-800 flex items-start gap-2">
                            <span className="text-red">•</span>
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 pt-6 border-t border-darkpapyrus">
              <div className="flex justify-center gap-8 text-center">
                <div>
                  <p className="text-2xl font-bold text-red">{iconsv2_questions.length}</p>
                  <p className="text-sm text-slate-600">Total Icons</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red">Preview</p>
                  <p className="text-sm text-slate-600">Status</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red">Coming Soon</p>
                  <p className="text-sm text-slate-600">Availability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
