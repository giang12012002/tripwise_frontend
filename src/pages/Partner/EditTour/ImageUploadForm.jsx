import React from 'react'

function ImageUploadForm({ tour, setTour }) {
    return (
        <div>
            <label className="block font-semibold">Hình ảnh</label>
            <div className="flex gap-2 flex-wrap">
                {tour.imageUrls?.map((url, idx) => (
                    <img
                        key={idx}
                        src={url}
                        alt={`tour-${idx}`}
                        className="w-24 h-24 object-cover rounded"
                    />
                ))}
            </div>
            <input
                type="file"
                multiple
                onChange={(e) => console.log(e.target.files)}
                className="mt-2"
            />
        </div>
    )
}

export default ImageUploadForm
