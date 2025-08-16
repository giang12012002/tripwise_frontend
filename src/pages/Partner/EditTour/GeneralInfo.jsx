import React from 'react'

function GeneralInfo({ tour, onChange }) {
    const handleChange = (e) => {
        const { name, value } = e.target
        onChange({ [name]: value })
    }

    const handleImageAdd = (files) => {
        const newImages = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        )
        onChange({ imageUrls: [...tour.imageUrls, ...newImages] })
    }

    const handleImageRemove = (index) => {
        const updated = [...tour.imageUrls]
        updated.splice(index, 1)
        onChange({ imageUrls: updated })
    }

    return (
        <div className="border p-4 rounded bg-white space-y-4">
            <div>
                <label className="block font-semibold">Tên tour</label>
                <input
                    type="text"
                    name="tourName"
                    value={tour.tourName || ''}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-semibold">Mô tả</label>
                <textarea
                    name="description"
                    value={tour.description || ''}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-semibold">Địa điểm</label>
                <input
                    type="text"
                    name="location"
                    value={tour.location || ''}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div>
                <label className="block font-semibold">Ngày khởi hành</label>
                <input
                    type="date"
                    name="travelDate"
                    value={tour.travelDate ? tour.travelDate.split('T')[0] : ''}
                    onChange={handleChange}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                {['priceAdult', 'priceChild5To10', 'priceChildUnder5'].map(
                    (field, i) => (
                        <div key={i}>
                            <label className="block font-semibold">
                                {field === 'priceAdult'
                                    ? 'Giá Người Lớn'
                                    : field === 'priceChild5To10'
                                      ? 'Giá Trẻ Em (5-10)'
                                      : 'Giá Trẻ Em (<5)'}
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    min="0"
                                    step="1000"
                                    name={field}
                                    value={tour[field] || ''}
                                    onChange={handleChange}
                                    className="border p-2 w-full rounded"
                                />
                                <span className="ml-2">đ</span>
                            </div>
                        </div>
                    )
                )}
            </div>

            <div>
                <label className="block font-semibold">Hình ảnh tour</label>
                <div className="flex gap-2 flex-wrap">
                    {tour.imageUrls?.map((url, idx) => (
                        <div key={idx} className="relative">
                            <img
                                src={url}
                                alt={`tour-${idx}`}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleImageRemove(idx)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <input
                    type="file"
                    multiple
                    onChange={(e) => handleImageAdd(e.target.files)}
                    className="mt-2"
                />
            </div>
        </div>
    )
}

export default GeneralInfo
