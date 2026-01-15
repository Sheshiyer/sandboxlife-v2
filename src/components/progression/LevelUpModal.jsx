import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/solid';

const LevelUpModal = ({ isOpen, onClose, levelData, unlockedIcons = [] }) => {
  const { new_level, new_title } = levelData || {};

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-lightpapyrus border-3 border-amber-500 shadow-2xl transition-all relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10">
                  <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                  <SparklesIcon className="absolute top-10 left-10 w-8 h-8 text-amber-500 animate-ping" />
                  <SparklesIcon className="absolute top-20 right-20 w-6 h-6 text-amber-500 animate-pulse" />
                </div>
                <div className="relative px-6 py-8 text-center">
                  <div className="mx-auto mb-4 inline-block relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center border-4 border-amber-700 shadow-xl">
                      <span className="text-white font-serif font-bold text-4xl">{new_level}</span>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2 border-2 border-white">
                      <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <Dialog.Title as="h3" className="text-3xl font-serif font-bold text-slate-900 mb-2">Level Up!</Dialog.Title>
                  <p className="text-lg text-slate-600 mb-1">You are now a</p>
                  <p className="text-2xl font-serif font-bold text-red mb-6">{new_title}</p>
                  {unlockedIcons?.length > 0 && (
                    <div className="bg-bgpapyrus rounded-xl p-4 border border-darkpapyrus mb-6">
                      <p className="text-sm font-semibold text-slate-700 mb-3">New Icons Unlocked!</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {unlockedIcons.map((icon, i) => (
                          <div key={i} className="w-12 h-12 rounded-lg bg-white border-2 border-amber-500 shadow-md flex items-center justify-center">
                            <span className="text-2xl">{icon.icon_name?.[0] || '🎯'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-slate-500 mb-6">Keep writing to unlock more icons and achievements!</p>
                  <button onClick={onClose} className="w-full px-6 py-3 bg-gradient-to-r from-red to-red/80 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                    Continue Your Journey
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

LevelUpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  levelData: PropTypes.shape({ new_level: PropTypes.number, new_xp: PropTypes.number, leveled_up: PropTypes.bool, new_title: PropTypes.string }),
  unlockedIcons: PropTypes.array,
};

export default LevelUpModal;
