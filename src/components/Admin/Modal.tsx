import React from 'react'

interface ModalProps {
  children: React.ReactNode
}

interface HeaderProps {
  title: string
  onClose: () => void
}

interface BodyProps {
  children: React.ReactNode
}

interface ModalComponent extends React.FC<ModalProps> {
  Header: React.FC<HeaderProps>
  Body: React.FC<BodyProps>
}

const Header: React.FC<HeaderProps> = ({ title, onClose }) => {
  return (
    <>
      <div className="relative">
        <div className="w-full pb-5 flex items-center justify-between">
          <h1 className="font-bold text-xl">{title}</h1>
          <button onClick={onClose} className="px-3 py-1 text-white bg-slate-400 font-bold rounded-lg shadow-xl hover:bg-red-500 duration-300">
            X
          </button>
        </div>
        <span className="absolute bottom-0 w-full h-[2px] bg-slate-400"></span>
      </div>
    </>
  )
}

const Body: React.FC<BodyProps> = ({ children }) => {
  return (
    <>
      <div className="mt-5">{children}</div>
    </>
  )
}

const Modal: ModalComponent = ({ children }) => {
  return (
    <>
      <div className="fixed flex justify-center items-center z-50 inset-0 bg-black/60">
        <div className="bg-white max-w-[1000px] rounded-lg p-5 max-h-[90vh] overflow-y-auto">{children}</div>
      </div>
    </>
  )
}

Modal.Header = Header
Modal.Body = Body

export default Modal
