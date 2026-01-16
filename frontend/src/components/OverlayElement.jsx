import React, { useRef, useCallback } from 'react';

const OverlayElement = ({ overlay, isSelected, onMouseDown, onDelete, onUpdate }) => {
  const elementRef = useRef(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startPos: { x: 0, y: 0 } });
  const resizeRef = useRef({ isResizing: false, startX: 0, startY: 0, startSize: { width: 0, height: 0 } });

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isSelected) {
      onMouseDown(e);
      return;
    }

    const rect = elementRef.current.getBoundingClientRect();
    const containerRect = elementRef.current.parentElement.getBoundingClientRect();
    
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPos: overlay.position
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  }, [isSelected, overlay.position, onMouseDown]);

  const handleResizeMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSelected) return;

    resizeRef.current = {
      isResizing: true,
      startX: e.clientX,
      startY: e.clientY,
      startSize: overlay.size
    };

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [isSelected, overlay.size]);

  const handleDrag = useCallback((e) => {
    if (!dragRef.current.isDragging) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    
    const newX = Math.max(0, dragRef.current.startPos.x + deltaX);
    const newY = Math.max(0, dragRef.current.startPos.y + deltaY);

    onUpdate(overlay._id, {
      position: { x: newX, y: newY }
    });
  }, [onUpdate]);

  const handleResize = useCallback((e) => {
    if (!resizeRef.current.isResizing) return;

    const deltaX = e.clientX - resizeRef.current.startX;
    const deltaY = e.clientY - resizeRef.current.startY;
    
    const newWidth = Math.max(50, resizeRef.current.startSize.width + deltaX);
    const newHeight = overlay.type === 'text' 
      ? resizeRef.current.startSize.height 
      : Math.max(50, resizeRef.current.startSize.height + deltaY);

    onUpdate(overlay._id, {
      size: { width: newWidth, height: newHeight }
    });
  }, [onUpdate, overlay.type]);

  const handleDragEnd = useCallback(() => {
    dragRef.current.isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  }, [handleDrag]);

  const handleResizeEnd = useCallback(() => {
    resizeRef.current.isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResize]);

  return (
    <div
      ref={elementRef}
      id={`overlay-${overlay._id}`}
      onMouseDown={handleMouseDown}
      className={`absolute z-20 transition-all duration-100 select-none group 
                 ${isSelected 
                   ? 'cursor-grab ring-2 ring-blue-400 ring-opacity-75 shadow-2xl' 
                   : 'cursor-pointer hover:shadow-lg hover:scale-105'
                 } 
                 ${dragRef.current.isDragging ? 'cursor-grabbing shadow-3xl scale-105' : ''}
                 ${resizeRef.current.isResizing ? 'cursor-nwse-resize' : ''}`}
      style={{
        left: `${overlay.position.x}px`,
        top: `${overlay.position.y}px`,
        width: `${overlay.size.width}px`,
        minHeight: overlay.type === 'text' ? '48px' : `${overlay.size.height}px`,
      }}
    >
      <div className={`w-full rounded-xl shadow-lg transition-all duration-200
                      ${overlay.type === 'text' 
                        ? 'bg-black/80 backdrop-blur-sm text-white px-4 py-3 text-lg font-bold whitespace-pre-wrap max-w-full border-2 border-transparent hover:border-white/30'
                        : 'bg-white/90 backdrop-blur-sm border-2 border-transparent hover:border-gray-300/50'
                      }`}>
        {overlay.type === 'text' ? (
          overlay.content || 'Click to edit...'
        ) : (
          <img
            src={overlay.content}
            alt="overlay"
            className="w-full h-25 object-contain rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        )}
        <div className="hidden text-sm text-gray-500 p-2 bg-red-500/20 rounded">Image failed to load</div>
      </div>

      {isSelected && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(overlay._id);
            }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white 
                       rounded-full flex items-center justify-center text-lg font-bold z-30 
                       shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
            title="Delete Overlay"
          >
            ✕
          </button>

          <div
            onMouseDown={handleResizeMouseDown}
            className="absolute -bottom-2 -right-2 w-6 h-6 bg-linear-to-br from-blue-500 to-blue-600 
                       hover:from-blue-400 hover:to-blue-500 rounded-full flex items-center justify-center 
                       text-white text-xs font-bold shadow-lg hover:shadow-xl cursor-nwse-resize z-30
                       transition-all duration-200 hover:scale-125 active:scale-110"
            title="Drag to resize"
          >
            ↘
          </div>
        </>
      )}
    </div>
  );
};

export default OverlayElement;
