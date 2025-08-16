import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// import { partnerTourAPI } from "@/apis"; // ⚠️ Bật lại khi tích hợp API

/**
 * UpdateTourForm (phiên bản hoàn chỉnh theo yêu cầu):
 * 1) UI gọn đẹp với Tailwind, chia card rõ ràng
 * 2) Lịch trình: thêm/xóa ngày, thêm/xóa hoạt động, auto đánh số ngày
 * 3) Giá: min=0, step=1000, chỉ nhận bội số 1000 + hiển thị đơn vị VNĐ
 * 4) Ngày/Giờ: dùng date picker; bỏ hẳn startTime; travelDate chọn bằng input type=date
 * 5) Ngày số: KHÔNG nhập, tự đếm theo vị trí trong mảng
 * 6) Ảnh: phần ảnh chính ở GeneralInfo; mỗi activity có ảnh riêng (hiển thị + upload)
 */

export default function UpdateTourForm() {
    const { tourId } = useParams()
    const [tour, setTour] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // ⚠️ Demo: mock dữ liệu để bạn chạy UI ngay. Khi tích hợp API thì thay bằng call thật.
        const mock = {
            tourId: 1034,
            tourName: 'Khám phá Hà Nội 3 ngày 2 đêm (Chỉnh sửa 123567)',
            description:
                'Quý khách cần mang theo CCCD, đối với trẻ em dưới 10 tuổi thì mang theo giấy khai sinh',
            location: 'Hà Nội',
            travelDate: '2025-08-14T18:56:47.223',
            days: '3',
            preferences: 'Văn Hóa',
            maxGroupSize: 5,
            priceAdult: 1250000,
            priceChild5To10: 300000,
            priceChildUnder5: 150000,
            totalEstimatedCost: 1250000,
            tourInfo:
                'Thăm quan thắng cảnh, thưởng thức ẩm thực Tây Nguyên, nghỉ trưa tại nhà Rông',
            tourNote: 'Tiền lưu trú, tiền ăn',
            status: 'Approved',
            imageUrls: [
                'https://res.cloudinary.com/durk39wbp/image/upload/v1753874291/story2.jpg',
                'https://res.cloudinary.com/durk39wbp/image/upload/v1753208356/story3.jpg',
                'https://res.cloudinary.com/durk39wbp/image/upload/v1754504331/story4.jpg'
            ],
            imageIds: ['2069', '2070', '2071'],
            itinerary: [
                {
                    itineraryId: 1043,
                    dayNumber: 1,
                    title: 'Khám phá Đà Nẵng',
                    dailyCost: 100000,
                    activities: [
                        {
                            attractionId: 1109,
                            startTime: '08:00:00',
                            endTime: '10:00:00',
                            description: 'Cầu Long Biên',
                            address: 'Cầu Long Biên',
                            estimatedCost: 100000,
                            placeDetail: 'Đi chơi tại cầu Long Biên',
                            imageUrls: [
                                'https://res.cloudinary.com/durk39wbp/image/upload/v1753968436/phuyen.jpg'
                            ]
                        }
                    ]
                }
            ]
        }

        setTimeout(() => {
            setTour({ ...mock, __newImages: [], __removedImageIndexes: [] })
            setLoading(false)
        }, 200)

        // Khi tích hợp API thật:
        // (async () => {
        //   try {
        //     const res = await partnerTourAPI.getTourDetail(tourId);
        //     setTour({ ...res.data, __newImages: [], __removedImageIndexes: [] });
        //   } catch (e) {
        //     console.error(e);
        //   } finally {
        //     setLoading(false);
        //   }
        // })();
    }, [tourId])

    if (loading) return <p className="p-6">Đang tải...</p>
    if (!tour) return <p className="p-6">Không tìm thấy tour</p>

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Cập nhật Tour</h1>

            {/* THÔNG TIN CHUNG + ẢNH */}
            <Card title="Thông tin chung">
                <GeneralInfoSection tour={tour} setTour={setTour} />
            </Card>

            {/* LỊCH TRÌNH */}
            <Card title="Lịch trình">
                <ItinerarySection tour={tour} setTour={setTour} />
            </Card>

            {/* HÀNH ĐỘNG */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    className="px-5 py-2.5 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-900"
                >
                    Hủy
                </button>
                <button
                    type="button"
                    className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow"
                    onClick={() => console.log('Submit payload:', tour)}
                >
                    Lưu thay đổi
                </button>
            </div>
        </div>
    )
}

/******************** UI PRIMITIVES ********************/
function Card({ title, children }) {
    return (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
            </div>
            <div className="p-5 md:p-6">{children}</div>
        </section>
    )
}

function Field({ label, children, help }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">
                {label}
            </label>
            {children}
            {help ? (
                <p className="text-xs text-gray-500 leading-snug">{help}</p>
            ) : null}
        </div>
    )
}

/******************** GENERAL INFO ********************/
function GeneralInfoSection({ tour, setTour }) {
    const handleChange = (name, value) =>
        setTour((p) => ({ ...p, [name]: value }))

    // Chuẩn hóa giá trị ngày từ ISO → yyyy-MM-dd
    const travelDateValue = tour.travelDate ? tour.travelDate.split('T')[0] : ''

    const onMainImagesChange = (e) => {
        const files = Array.from(e.target.files || [])
        setTour((prev) => ({
            ...prev,
            __newImages: files.map((file) => ({
                file,
                preview: URL.createObjectURL(file)
            }))
        }))
    }

    const removeExistingImage = (idx) => {
        setTour((prev) => ({
            ...prev,
            __removedImageIndexes: [...(prev.__removedImageIndexes || []), idx]
        }))
    }

    const removeNewImage = (idx) => {
        setTour((prev) => ({
            ...prev,
            __newImages: prev.__newImages.filter((_, i) => i !== idx)
        }))
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <Field label="Tên tour">
                    <input
                        type="text"
                        value={tour.tourName || ''}
                        onChange={(e) =>
                            handleChange('tourName', e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Field>

                <Field label="Mô tả">
                    <textarea
                        value={tour.description || ''}
                        onChange={(e) =>
                            handleChange('description', e.target.value)
                        }
                        rows={4}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Địa điểm">
                        <input
                            type="text"
                            value={tour.location || ''}
                            onChange={(e) =>
                                handleChange('location', e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>

                    <Field label="Ngày khởi hành">
                        <input
                            type="date"
                            value={travelDateValue}
                            onChange={(e) => {
                                const d = e.target.value // yyyy-MM-dd
                                const time =
                                    tour.travelDate?.split('T')[1] || '00:00:00'
                                handleChange(
                                    'travelDate',
                                    d ? `${d}T${time}` : ''
                                )
                            }}
                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Số ngày">
                        <input
                            type="number"
                            min={1}
                            value={Number(tour.days) || 1}
                            onChange={(e) =>
                                handleChange(
                                    'days',
                                    Math.max(1, Number(e.target.value || 1))
                                )
                            }
                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                    <Field label="Số lượng tối đa">
                        <input
                            type="number"
                            min={1}
                            value={Number(tour.maxGroupSize) || 1}
                            onChange={(e) =>
                                handleChange(
                                    'maxGroupSize',
                                    Math.max(1, Number(e.target.value || 1))
                                )
                            }
                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                    <div className="hidden md:block" />
                </div>

                {/* GIÁ */}
                <div className="grid grid-cols-1 gap-4">
                    <PriceInput
                        label="Giá Người Lớn"
                        name="priceAdult"
                        value={tour.priceAdult}
                        onChange={(v) => handleChange('priceAdult', v)}
                    />
                    <PriceInput
                        label="Giá Trẻ Em (5–10)"
                        name="priceChild5To10"
                        value={tour.priceChild5To10}
                        onChange={(v) => handleChange('priceChild5To10', v)}
                    />
                    <PriceInput
                        label="Giá Trẻ Em (<5)"
                        name="priceChildUnder5"
                        value={tour.priceChildUnder5}
                        onChange={(v) => handleChange('priceChildUnder5', v)}
                    />
                </div>

                <Field label="Thông tin tour">
                    <textarea
                        value={tour.tourInfo || ''}
                        onChange={(e) =>
                            handleChange('tourInfo', e.target.value)
                        }
                        rows={4}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Field>

                <Field label="Ghi chú">
                    <textarea
                        value={tour.tourNote || ''}
                        onChange={(e) =>
                            handleChange('tourNote', e.target.value)
                        }
                        rows={3}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </Field>
            </div>

            {/* ẢNH CHÍNH */}
            <div className="space-y-4">
                <Field label="Ảnh hiện tại">
                    <div className="flex flex-wrap gap-3">
                        {(tour.imageUrls || [])
                            .filter(
                                (_, idx) =>
                                    !tour.__removedImageIndexes?.includes(idx)
                            )
                            .map((url, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={url}
                                        alt={`img-${idx}`}
                                        className="w-28 h-28 object-cover rounded-xl border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(idx)}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        {(tour.__newImages || []).map((img, idx) => (
                            <div key={`new-${idx}`} className="relative">
                                <img
                                    src={img.preview}
                                    alt={`new-img-${idx}`}
                                    className="w-28 h-28 object-cover rounded-xl border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(idx)}
                                    className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        {!tour.imageUrls?.length &&
                            !tour.__newImages?.length && (
                                <p className="text-sm text-gray-500">
                                    Chưa có ảnh
                                </p>
                            )}
                    </div>
                </Field>

                <Field label="Thêm ảnh mới">
                    <input
                        type="file"
                        multiple
                        onChange={onMainImagesChange}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {tour.__newImages?.length ? (
                        <p className="text-xs text-gray-500 mt-1">
                            {tour.__newImages.length} file sẽ được tải lên
                        </p>
                    ) : null}
                </Field>
            </div>
        </div>
    )
}

function PriceInput({ label, value, onChange }) {
    const [error, setError] = useState('')

    const handle = (e) => {
        const raw = e.target.value
        const num = Number(raw)
        if (Number.isNaN(num)) {
            onChange(0)
            setError('')
            return
        }
        if (num < 0) {
            setError('Giá phải ≥ 0')
            onChange(0)
            return
        }
        // Bắt buộc bội số của 1000
        const rounded = Math.round(num / 1000) * 1000
        if (rounded !== num) {
            setError('Giá phải là bội số của 1.000')
        } else {
            setError('')
        }
        onChange(rounded)
    }

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-800">
                {label}
            </label>
            <div className="relative">
                <input
                    type="number"
                    min={0}
                    step={1000}
                    value={value ?? 0}
                    onChange={handle}
                    className="w-full border border-gray-300 rounded-xl pl-3.5 pr-14 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 text-sm font-semibold">
                    đ
                </span>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    )
}

/******************** ITINERARY ********************/
function ItinerarySection({ tour, setTour }) {
    const itinerary = tour.itinerary || []

    const addDay = () => {
        const next = [
            ...itinerary,
            {
                itineraryId: undefined,
                title: '',
                dailyCost: 0,
                activities: []
            }
        ]
        setTour({ ...tour, itinerary: next })
    }

    const removeDay = (index) => {
        const next = itinerary.filter((_, i) => i !== index)
        setTour({ ...tour, itinerary: next })
    }

    const updateDayField = (index, key, value) => {
        const next = [...itinerary]
        next[index] = { ...next[index], [key]: value }
        setTour({ ...tour, itinerary: next })
    }

    const addActivity = (dayIdx) => {
        const next = [...itinerary]
        const acts = next[dayIdx].activities ? [...next[dayIdx].activities] : []
        acts.push({
            attractionId: undefined,
            description: '',
            address: '',
            startTime: '',
            endTime: '',
            estimatedCost: 0,
            imageUrls: [],
            __files: [] // file upload tạm
        })
        next[dayIdx].activities = acts
        setTour({ ...tour, itinerary: next })
    }

    const removeActivity = (dayIdx, actIdx) => {
        const next = [...itinerary]
        next[dayIdx].activities = next[dayIdx].activities.filter(
            (_, i) => i !== actIdx
        )
        setTour({ ...tour, itinerary: next })
    }

    const updateActivityField = (dayIdx, actIdx, key, value) => {
        const next = [...itinerary]
        const acts = [...next[dayIdx].activities]
        acts[actIdx] = { ...acts[actIdx], [key]: value }
        next[dayIdx].activities = acts
        setTour({ ...tour, itinerary: next })
    }

    const onActivityFilesChange = (dayIdx, actIdx, files) => {
        const arr = Array.from(files || []).slice(0, 1) // Limit to 1 file
        const next = [...itinerary]
        const acts = [...next[dayIdx].activities]
        acts[actIdx] = { ...acts[actIdx], __files: arr, imageUrls: [] } // Clear old imageUrls
        next[dayIdx].activities = acts
        setTour({ ...tour, itinerary: next })
    }

    return (
        <div className="space-y-5">
            {itinerary.length === 0 && (
                <p className="text-gray-500">
                    Chưa có lịch trình. Nhấn "Thêm ngày" để bắt đầu.
                </p>
            )}

            {itinerary.map((day, dayIdx) => (
                <div
                    key={day.itineraryId || dayIdx}
                    className="rounded-2xl border p-4 md:p-5 bg-gray-50"
                >
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">
                            Ngày {dayIdx + 1}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100"
                                onClick={() => removeDay(dayIdx)}
                            >
                                Xóa ngày
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Tiêu đề">
                            <input
                                type="text"
                                value={day.title || ''}
                                onChange={(e) =>
                                    updateDayField(
                                        dayIdx,
                                        'title',
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </Field>

                        <Field label="Chi phí trong ngày">
                            <PriceInput
                                value={day.dailyCost ?? 0}
                                onChange={(v) =>
                                    updateDayField(dayIdx, 'dailyCost', v)
                                }
                            />
                        </Field>
                    </div>

                    {/* ACTIVITIES */}
                    <div className="mt-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Hoạt động</h4>
                            <button
                                type="button"
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
                                onClick={() => addActivity(dayIdx)}
                            >
                                Thêm hoạt động
                            </button>
                        </div>

                        {(day.activities || []).map((act, actIdx) => (
                            <div
                                key={act.attractionId || actIdx}
                                className="bg-white border rounded-xl p-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="text-sm text-gray-600 mt-1">
                                        #{actIdx + 1}
                                    </span>
                                    <button
                                        type="button"
                                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                        onClick={() =>
                                            removeActivity(dayIdx, actIdx)
                                        }
                                    >
                                        Xóa
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                    <Field label="Tên địa điểm / mô tả">
                                        <input
                                            type="text"
                                            value={act.description || ''}
                                            onChange={(e) =>
                                                updateActivityField(
                                                    dayIdx,
                                                    actIdx,
                                                    'description',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </Field>

                                    <Field label="Địa chỉ">
                                        <input
                                            type="text"
                                            value={act.address || ''}
                                            onChange={(e) =>
                                                updateActivityField(
                                                    dayIdx,
                                                    actIdx,
                                                    'address',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </Field>

                                    <Field label="Giờ bắt đầu">
                                        <input
                                            type="time"
                                            value={act.startTime || ''}
                                            onChange={(e) =>
                                                updateActivityField(
                                                    dayIdx,
                                                    actIdx,
                                                    'startTime',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </Field>

                                    <Field label="Giờ kết thúc">
                                        <input
                                            type="time"
                                            value={act.endTime || ''}
                                            onChange={(e) =>
                                                updateActivityField(
                                                    dayIdx,
                                                    actIdx,
                                                    'endTime',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </Field>

                                    <Field label="Chi phí hoạt động">
                                        <PriceInput
                                            value={act.estimatedCost ?? 0}
                                            onChange={(v) =>
                                                updateActivityField(
                                                    dayIdx,
                                                    actIdx,
                                                    'estimatedCost',
                                                    v
                                                )
                                            }
                                        />
                                    </Field>

                                    {/* ẢNH HOẠT ĐỘNG */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-800">
                                            Ảnh hoạt động
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {act.imageUrls?.[0] && (
                                                <img
                                                    src={act.imageUrls[0]}
                                                    alt="act-old"
                                                    className="w-20 h-20 rounded-lg object-cover border"
                                                />
                                            )}
                                            {act.__files?.[0] && (
                                                <img
                                                    src={URL.createObjectURL(
                                                        act.__files[0]
                                                    )}
                                                    alt="act-new"
                                                    className="w-20 h-20 rounded-lg object-cover border"
                                                />
                                            )}
                                            {!act.imageUrls?.length &&
                                                !act.__files?.length && (
                                                    <span className="text-xs text-gray-500">
                                                        Chưa có ảnh
                                                    </span>
                                                )}
                                        </div>
                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                onActivityFilesChange(
                                                    dayIdx,
                                                    actIdx,
                                                    e.target.files
                                                )
                                            }
                                            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {act.__files?.length ? (
                                            <p className="text-xs text-gray-500">
                                                {act.__files.length} file sẽ
                                                được tải lên
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="pt-2">
                <button
                    type="button"
                    onClick={addDay}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                >
                    + Thêm ngày
                </button>
            </div>
        </div>
    )
}

/******************** HELPERS ********************/
function normalizeToArray(imgs) {
    if (!imgs) return []
    if (Array.isArray(imgs)) return imgs
    // nếu backend trả về string URL đơn lẻ
    return [imgs]
}
