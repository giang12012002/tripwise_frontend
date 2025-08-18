// UpdateTour.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import partnerTourAPI from '@/apis/partnerTourAPI'
import Swal from 'sweetalert2'
import TimePicker from '@/components/ui/TimePicker'

const Index = () => {
    let { tourId } = useParams()
    const [tour, setTour] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [openDays, setOpenDays] = useState({})
    const [tourImages, setTourImages] = useState([])
    const [activityImages, setActivityImages] = useState({})
    const [tempUrlInput, setTempUrlInput] = useState({ tour: '' })
    const [originalTourUrls, setOriginalTourUrls] = useState(null)
    const tourFileInputRef = useRef(null)
    const activityFileInputRefs = useRef({})
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const MAX_IMAGES = 20

    const categories = ['Tham quan', 'Du lịch', 'Ẩm thực', 'Văn hóa']

    const isValidImage = (url) => {
        return new Promise((resolve) => {
            const img = new Image()
            img.src = url
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
        })
    }

    const toggleDay = (dayIndex) => {
        setOpenDays((prev) => ({ ...prev, [dayIndex]: !prev[dayIndex] }))
        console.log(
            `Toggled day ${dayIndex + 1}:`,
            openDays[dayIndex] ? 'Closed' : 'Opened'
        )
    }

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để chỉnh sửa tour.',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/signin')
        }
    }, [isLoggedIn, isAuthLoading, navigate])

    useEffect(() => {
        const savedScrollPosition = localStorage.getItem('scrollPosition')
        if (savedScrollPosition) {
            window.scrollTo(0, parseInt(savedScrollPosition, 10))
        }

        const handleBeforeUnload = () => {
            localStorage.setItem('scrollPosition', window.scrollY)
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            tourImages.forEach(
                (img) => img.type === 'new' && URL.revokeObjectURL(img.preview)
            )
            Object.values(activityImages)
                .flat()
                .forEach(
                    (img) =>
                        img.type === 'new' && URL.revokeObjectURL(img.preview)
                )
        }
    }, [tourImages, activityImages])

    // Fetch tour data
    useEffect(() => {
        const fetchTour = async () => {
            if (!tourId || isNaN(parseInt(tourId))) {
                setError('ID tour không hợp lệ.')
                setIsLoading(false)
                return
            }
            setIsLoading(true)
            try {
                const response = await partnerTourAPI.getTourDetail(tourId)

                const tourData = response.data

                console.log('Fetch tour response in EditTour:', tourData)

                const imageUrls = tourData.imageUrls || []
                const imageIds = tourData.imageIds || []
                setTourImages(
                    imageUrls.map((url, index) => ({
                        preview: url,
                        type: 'existing',
                        id: imageIds[index] || null
                    }))
                )

                setOriginalTourUrls(imageUrls)

                // ✅ Fix: luôn convert imageUrls và imageIds của activity thành mảng
                setActivityImages(
                    tourData.itinerary?.reduce(
                        (acc, day, dayIndex) => ({
                            ...acc,
                            ...day.activities.reduce(
                                (actAcc, act, actIndex) => ({
                                    ...actAcc,
                                    [`${dayIndex}-${actIndex}`]: (Array.isArray(
                                        act.imageUrls
                                    )
                                        ? act.imageUrls
                                        : [act.imageUrls]
                                    )
                                        .filter(Boolean)
                                        .map((url, i) => ({
                                            preview: url,
                                            type: 'existing',
                                            id: Array.isArray(act.imageIds)
                                                ? (Array.isArray(act.imageIds)
                                                      ? act.imageIds
                                                      : [act.imageIds])[i] ||
                                                  null
                                                : act.imageIds
                                                  ? act.imageIds
                                                  : null
                                        }))
                                }),
                                {}
                            )
                        }),
                        {}
                    ) || {}
                )

                setTour({
                    tourName: tourData.tourName || '',
                    description: tourData.description || '',
                    startTime:
                        tourData.startTime || tourData.StartTime
                            ? (tourData.startTime || tourData.StartTime).slice(
                                  0,
                                  16
                              ) // giữ nguyên ngày + giờ local
                            : '',

                    duration: tourData.days?.toString() || '1',
                    price: tourData.totalEstimatedCost || 0,
                    priceAdult: tourData.priceAdult || 0,
                    priceChild5To10: tourData.priceChild5To10 || 0,
                    priceChildUnder5: tourData.priceChildUnder5 || 0,
                    location: tourData.location || '',
                    maxGroupSize: tourData.maxGroupSize || 1,
                    category: tourData.preferences || '',
                    tourNote: tourData.tourNote || '',
                    tourInfo: tourData.tourInfo || '',
                    status: tourData.status || 'Draft',
                    rejectReason: tourData.rejectReason || '',
                    imageFiles: [],
                    imageUrls: imageUrls,
                    imageIds: imageIds,
                    itinerary:
                        tourData.itinerary?.map((day) => ({
                            itineraryId: day.itineraryId || null,
                            dayNumber: day.dayNumber || 1,
                            title: day.title || '',
                            activities:
                                day.activities?.map((act) => ({
                                    attractionId: act.attractionId || null,
                                    description: act.description || '',
                                    address: act.address || '',
                                    placeDetail: act.placeDetail || '',
                                    estimatedCost: act.estimatedCost || 0,
                                    startTime: act.startTime || '',
                                    endTime: act.endTime || '',
                                    mapUrl: act.mapUrl || '',
                                    category: act.category || '',
                                    imageFiles: [],
                                    imageUrls: Array.isArray(act.imageUrls)
                                        ? act.imageUrls
                                        : [act.imageUrls].filter(Boolean),
                                    imageIds: Array.isArray(act.imageIds)
                                        ? act.imageIds
                                        : [act.imageIds].filter(Boolean)
                                })) || []
                        })) || []
                })
            } catch (err) {
                setError('Không thể tải tour. Vui lòng thử lại.')
                console.error('API Error (fetchTour):', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    errors:
                        err.response?.data?.errors || 'Không có chi tiết lỗi'
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchTour()
    }, [tourId])

    const handleTourChange = (e) => {
        const { name, value } = e.target
        const newValue =
            name === 'price' ||
            name === 'maxGroupSize' ||
            name === 'priceAdult' ||
            name === 'priceChild5To10' ||
            name === 'priceChildUnder5'
                ? parseFloat(value) || 0
                : value
        setTour({ ...tour, [name]: newValue })
        console.log(`Tour field updated: ${name} = ${newValue}`)
    }

    const handleAddTourImageFromFile = () => {
        tourFileInputRef.current.click()
    }

    const handleTourImageFiles = (e) => {
        const files = e.target.files
        const validFiles = Array.from(files).filter(
            (file) =>
                ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) &&
                file.size <= 10 * 1024 * 1024
        )
        if (validFiles.length !== files.length) {
            setError('Chỉ chấp nhận tệp hình ảnh (jpg, jpeg, png) dưới 10MB.')
            return
        }
        if (tourImages.length + validFiles.length > MAX_IMAGES) {
            setError(`Tổng số ảnh không được vượt quá ${MAX_IMAGES}.`)
            return
        }
        const newFiles = validFiles.map((file) => ({
            preview: URL.createObjectURL(file),
            type: 'new',
            file
        }))
        setTourImages([...tourImages, ...newFiles])
        setTour({
            ...tour,
            imageFiles: [...tour.imageFiles, ...validFiles], // giữ cả ảnh mới
            imageUrls: [
                ...tour.imageUrls, // giữ URL cũ
                ...tourImages
                    .filter((img) => img.type === 'url')
                    .map((img) => img.preview)
            ],
            imageIds: tour.imageIds // giữ nguyên
        })

        console.log(
            'Tour imageFiles added:',
            validFiles.map((f) => ({ name: f.name, size: f.size }))
        )
    }

    const handleAddTourUrl = async () => {
        const value = tempUrlInput.tour
        const urls = value
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url)
        if (tourImages.length + urls.length > MAX_IMAGES) {
            setError(`Tổng số ảnh không được vượt quá ${MAX_IMAGES}.`)
            return
        }
        if (
            urls.length !== value.split(',').filter((url) => url.trim()).length
        ) {
            setError('Một số URL hình ảnh không hợp lệ.')
            return
        }
        const validUrls = []
        for (const url of urls) {
            try {
                new URL(url)
                if (await isValidImage(url)) {
                    validUrls.push(url)
                } else {
                    setError(`URL không phải là hình ảnh hợp lệ: ${url}`)
                    return
                }
            } catch {
                setError('Một số URL hình ảnh không hợp lệ.')
                return
            }
        }
        const newUrls = validUrls.map((url) => ({ preview: url, type: 'url' }))
        setTourImages([...tourImages, ...newUrls])
        setTour({
            ...tour,
            imageUrls: [...tour.imageUrls, ...validUrls],
            imageIds: tourImages
                .filter((img) => img.type === 'existing')
                .map((img) => img.id)
        })
        setTempUrlInput({ ...tempUrlInput, tour: '' })
        console.log('Tour imageUrls added:', validUrls)
    }

    const removeTourImage = async (index) => {
        const removedImage = tourImages[index]
        setTourImages(tourImages.filter((_, i) => i !== index))
        if (removedImage.type === 'new') {
            URL.revokeObjectURL(removedImage.preview)
            setTour({
                ...tour,
                imageFiles: tour.imageFiles.filter(
                    (_, i) =>
                        i !==
                        tourImages
                            .filter((img) => img.type === 'new')
                            .indexOf(removedImage)
                )
            })
            console.log('Ảnh đã xóa: ' + removedImage.file.name)
        } else if (removedImage.type === 'existing' && removedImage.id) {
            try {
                await partnerTourAPI.deleteMultipleTourImages([removedImage.id])
                setTour({
                    ...tour,
                    imageUrls: tour.imageUrls.filter(
                        (_, i) =>
                            i !==
                            tourImages
                                .filter((img) => img.type === 'existing')
                                .indexOf(removedImage)
                    ),
                    imageIds: tour.imageIds.filter(
                        (id) => id !== removedImage.id
                    )
                })
                console.log('Xóa ảnh: ' + removedImage.id)
                console.log('Tour sau khi xóa ảnh: ', tour)
            } catch (err) {
                setError('Không thể xóa ảnh. Vui lòng thử lại.')
                console.error('Failed to delete tour image:', err)
            }
        } else {
            setTour({
                ...tour,
                imageUrls: tour.imageUrls.filter(
                    (_, i) =>
                        i !==
                        tourImages
                            .filter((img) => img.type === 'url')
                            .indexOf(removedImage)
                )
            })
        }
        console.log(`Removed tour image at index ${index}`)
    }

    const clearTourImages = async () => {
        const existingImageIds = tourImages
            .filter((img) => img.type === 'existing' && img.id)
            .map((img) => img.id)
        if (existingImageIds.length > 0) {
            try {
                await partnerTourAPI.deleteMultipleTourImages(existingImageIds)
                console.log('Tour sau khi xóa ảnh: ', tour)
            } catch (err) {
                setError('Không thể xóa tất cả ảnh. Vui lòng thử lại.')
                console.error('Failed to clear tour images:', err)
            }
        }
        tourImages.forEach(
            (img) => img.type === 'new' && URL.revokeObjectURL(img.preview)
        )
        setTourImages([])
        setTour({ ...tour, imageFiles: [], imageUrls: [], imageIds: [] })
        setTempUrlInput({ ...tempUrlInput, tour: '' })
        console.log('Cleared all tour images')
    }

    const handleDayChange = (dayIndex, field, value) => {
        const newItinerary = [...tour.itinerary]
        newItinerary[dayIndex][field] = value
        setTour({ ...tour, itinerary: newItinerary })
        console.log(`Day ${dayIndex + 1} updated: ${field} = ${value}`)
    }

    const handleActivityChange = (dayIndex, activityIndex, field, value) => {
        const newItinerary = [...tour.itinerary]
        if (field === 'imageFiles') {
            const files = value.files
            const validFiles = Array.from(files).filter(
                (file) =>
                    ['image/jpeg', 'image/png', 'image/jpg'].includes(
                        file.type
                    ) && file.size <= 10 * 1024 * 1024
            )
            if (validFiles.length !== files.length) {
                setError(
                    'Chỉ chấp nhận tệp hình ảnh (jpg, jpeg, png) dưới 10MB.'
                )
                return
            }
            const key = `${dayIndex}-${activityIndex}`
            if (
                (activityImages[key]?.length || 0) + validFiles.length >
                MAX_IMAGES
            ) {
                setError(
                    `Tổng số ảnh không được vượt quá ${MAX_IMAGES} cho hoạt động.`
                )
                return
            }
            const newFiles = validFiles.map((file) => ({
                preview: URL.createObjectURL(file),
                type: 'new',
                file
            }))
            setActivityImages({
                ...activityImages,
                [key]: [...(activityImages[key] || []), ...newFiles]
            })
            newItinerary[dayIndex].activities[activityIndex].imageFiles = [
                ...newItinerary[dayIndex].activities[activityIndex].imageFiles,
                ...validFiles
            ]
            setTour({ ...tour, itinerary: newItinerary })
            console.log(
                `Activity ${activityIndex + 1} (Day ${dayIndex + 1}) imageFiles added:`,
                validFiles.map((f) => ({ name: f.name, size: f.size }))
            )
        } else {
            const newValue =
                field === 'estimatedCost' ? parseFloat(value) || 0 : value
            newItinerary[dayIndex].activities[activityIndex][field] = newValue
            setTour({ ...tour, itinerary: newItinerary })
            console.log(
                `Activity ${activityIndex + 1} (Day ${dayIndex + 1}) updated: ${field} = ${newValue}`
            )
        }
    }

    const handleAddActivityImageFromFile = (dayIndex, activityIndex) => {
        const key = `${dayIndex}-${activityIndex}`
        if (!activityFileInputRefs.current[key]) {
            activityFileInputRefs.current[key] = React.createRef()
        }
        activityFileInputRefs.current[key].current.click()
        console.log(
            `Opening file input for activity ${activityIndex + 1} (Day ${dayIndex + 1})`
        )
    }

    const handleAddActivityUrl = async (dayIndex, activityIndex) => {
        const key = `${dayIndex}-${activityIndex}`
        const value = tempUrlInput[key] || ''
        const urls = value
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url)
        if ((activityImages[key]?.length || 0) + urls.length > MAX_IMAGES) {
            setError(
                `Tổng số ảnh không được vượt quá ${MAX_IMAGES} cho hoạt động.`
            )
            return
        }
        if (
            urls.length !== value.split(',').filter((url) => url.trim()).length
        ) {
            setError(
                `Một số URL hình ảnh không hợp lệ cho hoạt động ngày ${dayIndex + 1}.`
            )
            return
        }
        const validUrls = []
        for (const url of urls) {
            try {
                new URL(url)
                if (await isValidImage(url)) {
                    validUrls.push(url)
                } else {
                    setError(`URL không phải là hình ảnh hợp lệ: ${url}`)
                    return
                }
            } catch {
                setError(
                    `Một số URL hình ảnh không hợp lệ cho hoạt động ngày ${dayIndex + 1}.`
                )
                return
            }
        }
        const newUrls = validUrls.map((url) => ({ preview: url, type: 'url' }))
        setActivityImages({
            ...activityImages,
            [key]: [...(activityImages[key] || []), ...newUrls]
        })
        const newItinerary = [...tour.itinerary]
        newItinerary[dayIndex].activities[activityIndex].imageUrls = [
            ...newItinerary[dayIndex].activities[activityIndex].imageUrls,
            ...validUrls
        ]
        setTour({ ...tour, itinerary: newItinerary })
        setTempUrlInput({ ...tempUrlInput, [key]: '' })
        console.log(
            `Activity ${activityIndex + 1} (Day ${dayIndex + 1}) imageUrls added:`,
            validUrls
        )
    }

    const removeActivityImage = async (dayIndex, activityIndex, index) => {
        const key = `${dayIndex}-${activityIndex}`
        const removedImage = activityImages[key][index]
        setActivityImages({
            ...activityImages,
            [key]: activityImages[key].filter((_, i) => i !== index)
        })
        const newItinerary = [...tour.itinerary]
        if (removedImage.type === 'new') {
            URL.revokeObjectURL(removedImage.preview)
            newItinerary[dayIndex].activities[activityIndex].imageFiles =
                newItinerary[dayIndex].activities[
                    activityIndex
                ].imageFiles.filter(
                    (_, i) =>
                        i !==
                        activityImages[key]
                            .filter((img) => img.type === 'new')
                            .indexOf(removedImage)
                )
        } else if (removedImage.type === 'existing' && removedImage.id) {
            try {
                await partnerTourAPI.deleteMultipleActivityImages([
                    removedImage.id
                ])
                newItinerary[dayIndex].activities[activityIndex].imageUrls =
                    newItinerary[dayIndex].activities[
                        activityIndex
                    ].imageUrls.filter(
                        (_, i) =>
                            i !==
                            activityImages[key]
                                .filter((img) => img.type === 'existing')
                                .indexOf(removedImage)
                    )
                newItinerary[dayIndex].activities[activityIndex].imageIds =
                    newItinerary[dayIndex].activities[
                        activityIndex
                    ].imageIds.filter((id) => id !== removedImage.id)
            } catch (err) {
                setError('Không thể xóa ảnh hoạt động. Vui lòng thử lại.')
                console.error('Failed to delete activity image:', err)
            }
        } else {
            newItinerary[dayIndex].activities[activityIndex].imageUrls =
                newItinerary[dayIndex].activities[
                    activityIndex
                ].imageUrls.filter(
                    (_, i) =>
                        i !==
                        activityImages[key]
                            .filter((img) => img.type === 'url')
                            .indexOf(removedImage)
                )
        }
        setTour({ ...tour, itinerary: newItinerary })
        console.log(
            `Removed activity image at index ${index} for day ${dayIndex + 1}, activity ${activityIndex + 1}`
        )
    }

    const clearActivityImages = async (dayIndex, activityIndex) => {
        const key = `${dayIndex}-${activityIndex}`
        const existingImageIds = activityImages[key]
            ?.filter((img) => img.type === 'existing' && img.id)
            .map((img) => img.id)
        if (existingImageIds?.length > 0) {
            try {
                await partnerTourAPI.deleteMultipleActivityImages(
                    existingImageIds
                )
            } catch (err) {
                setError(
                    'Không thể xóa tất cả ảnh hoạt động. Vui lòng thử lại.'
                )
                console.error('Failed to clear activity images:', err)
            }
        }
        activityImages[key]?.forEach(
            (img) => img.type === 'new' && URL.revokeObjectURL(img.preview)
        )
        setActivityImages({ ...activityImages, [key]: [] })
        const newItinerary = [...tour.itinerary]
        newItinerary[dayIndex].activities[activityIndex].imageFiles = []
        newItinerary[dayIndex].activities[activityIndex].imageUrls = []
        newItinerary[dayIndex].activities[activityIndex].imageIds = []
        setTour({ ...tour, itinerary: newItinerary })
        setTempUrlInput({ ...tempUrlInput, [key]: '' })
        console.log(
            `Cleared all images for day ${dayIndex + 1}, activity ${activityIndex + 1}`
        )
    }

    const addDay = () => {
        const newItinerary = [
            ...tour.itinerary,
            {
                dayNumber: tour.itinerary.length + 1,
                title: '',
                itineraryId: null,
                activities: [
                    {
                        attractionId: null,
                        description: '',
                        address: '',
                        placeDetail: '',
                        estimatedCost: 0,
                        startTime: '',
                        endTime: '',
                        mapUrl: '',
                        category: '',
                        imageFiles: [],
                        imageUrls: [],
                        imageIds: []
                    }
                ]
            }
        ]
        setTour({ ...tour, itinerary: newItinerary })
        setOpenDays({ ...openDays, [tour.itinerary.length]: true })
        console.log('Added new day:', tour.itinerary.length + 1)
    }

    const removeDay = async (dayIndex) => {
        if (tour.itinerary.length === 1) {
            setError('Phải có ít nhất một ngày trong lịch trình.')
            return
        }
        const itinerary = tour.itinerary[dayIndex]
        if (itinerary.itineraryId) {
            try {
                for (const activity of itinerary.activities) {
                    if (activity.attractionId) {
                        console.log(
                            `Deleting activity with ID: ${activity.attractionId}`
                        )
                        await partnerTourAPI.deleteActivity(
                            activity.attractionId
                        )
                    }
                }
                console.log(
                    `Deleting itinerary with ID: ${itinerary.itineraryId}`
                )
                await partnerTourAPI.deleteItinerary(itinerary.itineraryId)
            } catch (err) {
                setError('Không thể xóa lịch trình. Vui lòng thử lại.')
                console.error('API Error (removeDay):', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    errors:
                        err.response?.data?.errors || 'Không có chi tiết lỗi'
                })
                return
            }
        }
        const newItinerary = tour.itinerary.filter(
            (_, index) => index !== dayIndex
        )
        newItinerary.forEach((day, index) => {
            day.dayNumber = index + 1
        })
        setTour({ ...tour, itinerary: newItinerary })
        setActivityImages((prev) => {
            const newImages = { ...prev }
            Object.keys(newImages).forEach((key) => {
                if (key.startsWith(`${dayIndex}-`)) delete newImages[key]
            })
            return newImages
        })
        setTempUrlInput((prev) => {
            const newTemp = { ...prev }
            Object.keys(newTemp).forEach((key) => {
                if (key.startsWith(`${dayIndex}-`)) delete newTemp[key]
            })
            return newTemp
        })
        console.log(`Removed day ${dayIndex + 1}`)
    }

    const addActivity = (dayIndex) => {
        const newItinerary = [...tour.itinerary]
        newItinerary[dayIndex].activities.push({
            attractionId: null,
            description: '',
            address: '',
            placeDetail: '',
            estimatedCost: 0,
            startTime: '',
            endTime: '',
            mapUrl: '',
            category: '',
            imageFiles: [],
            imageUrls: [],
            imageIds: []
        })
        setTour({ ...tour, itinerary: newItinerary })
        console.log(`Added new activity to day ${dayIndex + 1}`)
    }

    const removeActivity = async (dayIndex, activityIndex) => {
        const newItinerary = [...tour.itinerary]
        if (newItinerary[dayIndex].activities.length === 1) {
            setError('Mỗi ngày phải có ít nhất một hoạt động.')
            return
        }
        const activity = newItinerary[dayIndex].activities[activityIndex]
        if (activity.attractionId) {
            try {
                console.log(
                    `Deleting activity with ID: ${activity.attractionId}`
                )
                await partnerTourAPI.deleteActivity(activity.attractionId)
            } catch (err) {
                setError('Không thể xóa hoạt động. Vui lòng thử lại.')
                console.error('API Error (removeActivity):', {
                    message: err.message,
                    response: err.response?.data,
                    status: err.response?.status,
                    errors:
                        err.response?.data?.errors || 'Không có chi tiết lỗi'
                })
                return
            }
        }
        newItinerary[dayIndex].activities = newItinerary[
            dayIndex
        ].activities.filter((_, index) => index !== activityIndex)
        setTour({ ...tour, itinerary: newItinerary })
        setActivityImages((prev) => {
            const newImages = { ...prev }
            delete newImages[`${dayIndex}-${activityIndex}`]
            return newImages
        })
        setTempUrlInput((prev) => {
            const newTemp = { ...prev }
            delete newTemp[`${dayIndex}-${activityIndex}`]
            return newTemp
        })
        console.log(
            `Removed activity ${activityIndex + 1} from day ${dayIndex + 1}`
        )
    }

    const validateForm = () => {
        if (!tour.tourName.trim()) return 'Tên tour là bắt buộc.'
        if (!tour.location.trim()) return 'Địa điểm là bắt buộc.'
        if (!tour.description.trim()) return 'Mô tả là bắt buộc.'
        if (!tour.category.trim()) return 'Danh mục là bắt buộc.'
        if (!tour.tourInfo.trim()) return 'Thông tin tour là bắt buộc.'
        if (!tour.tourNote.trim()) return 'Ghi chú tour là bắt buộc.'
        if (
            !tour.duration ||
            isNaN(parseInt(tour.duration)) ||
            parseInt(tour.duration) <= 0
        )
            return 'Thời gian phải là số lớn hơn 0.'
        if (isNaN(tour.price) || tour.price < 0) return 'Giá không được âm.'
        if (isNaN(tour.priceAdult) || tour.priceAdult < 0)
            return 'Giá người lớn không được âm.'
        if (isNaN(tour.priceChild5To10) || tour.priceChild5To10 < 0)
            return 'Giá trẻ em (5-10 tuổi) không được âm.'
        if (isNaN(tour.priceChildUnder5) || tour.priceChildUnder5 < 0)
            return 'Giá trẻ em (dưới 5 tuổi) không được âm.'
        if (isNaN(tour.maxGroupSize) || tour.maxGroupSize <= 0)
            return 'Số người tối đa phải lớn hơn 0.'
        if (tourImages.length === 0)
            return 'Phải cung cấp ít nhất một hình ảnh cho tour.'
        for (let day of tour.itinerary) {
            if (!day.title.trim())
                return `Tiêu đề ngày ${day.dayNumber} là bắt buộc.`
            for (let activity of day.activities) {
                if (!activity.description.trim())
                    return `Mô tả hoạt động trong ngày ${day.dayNumber} là bắt buộc.`
                if (!activity.address.trim())
                    return `Địa chỉ hoạt động trong ngày ${day.dayNumber} là bắt buộc.`
                if (!activity.placeDetail.trim())
                    return `Chi tiết địa điểm trong ngày ${day.dayNumber} là bắt buộc.`
                if (isNaN(activity.estimatedCost) || activity.estimatedCost < 0)
                    return `Chi phí dự kiến trong ngày ${day.dayNumber} không được âm.`
                if (
                    (activityImages[
                        `${tour.itinerary.indexOf(day)}-${day.activities.indexOf(activity)}`
                    ]?.length || 0) === 0
                )
                    return `Phải cung cấp ít nhất một hình ảnh cho hoạt động trong ngày ${day.dayNumber}.`
            }
        }
        return ''
    }

    const handleUpdate = async () => {
        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            console.error('Lỗi xác thực:', validationError)
            return
        }

        setIsLoading(true)

        try {
            // let tourDraft = null
            // if (tour.status === 'Approved') {
            //     const response = await partnerTourAPI.createOrGet({ tourId })
            //     tourDraft = response.data
            //     tourId = tourDraft.tourId
            // }

            // Cập nhật thông tin tour
            const formData = new FormData()
            formData.append('TourName', tour.tourName)
            formData.append('StartTime', tour.startTime || '')
            formData.append('Description', tour.description)
            formData.append('Duration', parseInt(tour.duration) || 1)
            formData.append('Price', parseFloat(tour.price) || 0)
            formData.append('PriceAdult', parseFloat(tour.priceAdult) || 0)
            formData.append(
                'PriceChild5To10',
                parseFloat(tour.priceChild5To10) || 0
            )
            formData.append(
                'PriceChildUnder5',
                parseFloat(tour.priceChildUnder5) || 0
            )
            formData.append('Location', tour.location)
            formData.append('MaxGroupSize', parseInt(tour.maxGroupSize) || 1)
            formData.append('Category', tour.category)
            formData.append('TourNote', tour.tourNote || '')
            formData.append('TourInfo', tour.tourInfo || '')

            // sửa ở đây
            // tourImages
            //     .filter((img) => img.type === 'existing')
            //     .forEach((img) => formData.append('ImageIds', img.id))
            // tourImages
            //     .filter((img) => img.type === 'new' && img.file)
            //     .forEach((img) => formData.append('ImageFiles', img.file))
            // tour.imageUrls.forEach((url) => formData.append('Image', url))

            tourImages
                .filter((img) => img.type === 'existing' && img.id)
                .forEach((img) => formData.append('ImageIds', img.id))

            tourImages
                .filter((img) => img.type === 'new' && img.file)
                .forEach((img) => formData.append('imageFiles', img.file))

            // tour.imageUrls.forEach((url) => formData.append('imageUrls', url))

            const newImageUrls = tourImages
                .filter((img) => img.type === 'url')
                .map((img) => img.preview)

            newImageUrls.forEach((url) => formData.append('ImageUrls', url))

            console.log('Tour Images cho cập nhật:', tourImages)

            console.log('New Image URLs cho cập nhật:', newImageUrls)

            console.log(
                'Tour FormData cho cập nhật:',
                Array.from(formData.entries())
            )

            const updateTourResponse = await partnerTourAPI.updateTour(
                tourId,
                formData
            )
            console.log('Phản hồi cập nhật tour:', updateTourResponse.data)

            // Cập nhật lịch trình và hoạt động
            const newItinerary = [...tour.itinerary]
            for (
                let dayIndex = 0;
                dayIndex < tour.itinerary.length;
                dayIndex++
            ) {
                const day = tour.itinerary[dayIndex]
                const itineraryPayload = {
                    DayNumber: day.dayNumber,
                    Title: day.title || `Ngày ${day.dayNumber}`
                }
                let itineraryId = day.itineraryId
                if (itineraryId) {
                    console.log(
                        `Cập nhật lịch trình với ID: ${itineraryId}`,
                        itineraryPayload
                    )
                    const updateItineraryResponse =
                        await partnerTourAPI.updateItinerary(
                            itineraryId,
                            itineraryPayload
                        )
                    console.log(
                        `Phản hồi cập nhật lịch trình cho ngày ${day.dayNumber}:`,
                        updateItineraryResponse.data
                    )
                } else {
                    console.log(
                        `Tạo lịch trình mới cho ngày ${day.dayNumber}:`,
                        itineraryPayload
                    )
                    const createItineraryResponse =
                        await partnerTourAPI.createItinerary(
                            tourId,
                            itineraryPayload
                        )
                    console.log(
                        `Phản hồi tạo lịch trình cho ngày ${day.dayNumber}:`,
                        createItineraryResponse.data
                    )
                    itineraryId = createItineraryResponse.data.data
                    newItinerary[dayIndex].itineraryId = itineraryId
                }

                for (
                    let activityIndex = 0;
                    activityIndex < day.activities.length;
                    activityIndex++
                ) {
                    const activity = day.activities[activityIndex]
                    const activityFormData = new FormData()
                    activityFormData.append(
                        'PlaceDetail',
                        activity.placeDetail || ''
                    )
                    activityFormData.append(
                        'Description',
                        activity.description || ''
                    )
                    activityFormData.append('Address', activity.address || '')
                    activityFormData.append(
                        'EstimatedCost',
                        parseFloat(activity.estimatedCost) || 0
                    )
                    activityFormData.append(
                        'StartTime',
                        activity.startTime || ''
                    )
                    activityFormData.append('EndTime', activity.endTime || '')
                    activityFormData.append('MapUrl', activity.mapUrl || '')
                    activityFormData.append('Category', activity.category || '')

                    const activityKey = `${dayIndex}-${activityIndex}`
                    const currentActivityImages =
                        activityImages[activityKey] || []

                    // Chỉ gửi một ảnh cho hoạt động (mới hoặc URL)
                    if (currentActivityImages.length > 0) {
                        const latestImage = currentActivityImages[0] // Lấy ảnh đầu tiên (giới hạn 1 ảnh)
                        if (latestImage.type === 'new' && latestImage.file) {
                            activityFormData.append(
                                'ImageFiles',
                                latestImage.file
                            )
                        } else if (
                            latestImage.type === 'url' ||
                            latestImage.type === 'existing'
                        ) {
                            activityFormData.append(
                                'ImageUrls',
                                latestImage.preview
                            )
                        }
                        if (latestImage.type === 'existing' && latestImage.id) {
                            activityFormData.append('ImageIds', latestImage.id)
                        }
                    }

                    console.log(
                        `Dữ liệu gửi lên cho hoạt động (Ngày ${day.dayNumber}, Hoạt động ${activityIndex + 1}):`,
                        {
                            imageFiles: activity.imageFiles.map((f) => ({
                                name: f.name,
                                size: f.size
                            })),
                            imageUrls: activity.imageUrls,
                            imageIds: activity.imageIds,
                            activityImages: currentActivityImages.map(
                                (img) => ({
                                    preview: img.preview,
                                    type: img.type,
                                    id: img.id
                                })
                            )
                        }
                    )

                    if (activity.attractionId) {
                        console.log(
                            `Cập nhật hoạt động với ID: ${activity.attractionId}`,
                            Array.from(activityFormData.entries())
                        )
                        const updateActivityResponse =
                            await partnerTourAPI.updateActivity(
                                activity.attractionId,
                                activityFormData
                            )
                        console.log(
                            `Phản hồi cập nhật hoạt động (Ngày ${day.dayNumber}, Hoạt động ${activityIndex + 1}):`,
                            updateActivityResponse.data
                        )
                    } else {
                        console.log(
                            `Tạo hoạt động mới cho ngày ${day.dayNumber}:`,
                            Array.from(activityFormData.entries())
                        )
                        const createActivityResponse =
                            await partnerTourAPI.createActivity(
                                itineraryId,
                                activityFormData
                            )
                        console.log(
                            `Phản hồi tạo hoạt động (Ngày ${day.dayNumber}, Hoạt động ${activityIndex + 1}):`,
                            createActivityResponse.data
                        )
                        newItinerary[dayIndex].activities[
                            activityIndex
                        ].attractionId = createActivityResponse.data.data
                    }
                }
            }

            setTour({ ...tour, itinerary: newItinerary })
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Cập nhật tour thành công!',
                showConfirmButton: false,
                timer: 1500
            })
            navigate('/partner')
        } catch (err) {
            setError('Không thể cập nhật tour. Vui lòng thử lại.')
            console.error('API Error (handleUpdate):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
                <div className="flex-grow flex items-center justify-center max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3 p-6 bg-white rounded-xl shadow-lg">
                        <svg
                            className="animate-spin h-8 w-8 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span className="text-lg font-medium text-gray-700">
                            Đang tải...
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    if (!tour) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
                <div className="flex-grow max-w-6xl w-full px-4 sm:px-6 lg:px-14 py-12">
                    <div className="text-center bg-white p-8 rounded-xl shadow-lg w-full">
                        <p className="text-gray-600 text-lg">
                            Không tìm thấy tour.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-grow max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
            {error && (
                <p className="text-red-500 mb-6 text-center font-medium text-lg">
                    {error}
                </p>
            )}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                    Chỉnh Sửa Tour
                </h1>
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Tên Tour
                        </label>
                        <input
                            type="text"
                            name="tourName"
                            value={tour.tourName}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="Nhập tên tour du lịch"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Địa Điểm
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={tour.location}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="Nhập địa điểm"
                        />
                    </div>
                    {/* <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Chủ Đề
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={tour.category}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="Nhập chủ đề tour"
                        />
                    </div> */}

                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Chủ Đề
                        </label>
                        <select
                            name="category"
                            value={tour.category}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            {/* Thêm một tùy chọn mặc định không có giá trị */}
                            <option value="" disabled>
                                Chọn một chủ đề
                            </option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Thời Gian Bắt Đầu
                        </label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={tour.startTime}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Số ngày
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={tour.duration}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="1"
                            placeholder="Số ngày"
                        />
                    </div>
                    <div className="hidden">
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Giá (VND)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={tour.price}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                            placeholder="Nhập giá tour"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Giá Người Lớn (VND)
                        </label>
                        <input
                            type="number"
                            name="priceAdult"
                            value={tour.priceAdult}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                            placeholder="Giá người lớn"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Giá Trẻ Em (5-10 tuổi) (VND)
                        </label>
                        <input
                            type="number"
                            name="priceChild5To10"
                            value={tour.priceChild5To10}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                            placeholder="Giá trẻ em 5-10 tuổi"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Giá Trẻ Em (dưới 5 tuổi) (VND)
                        </label>
                        <input
                            type="number"
                            name="priceChildUnder5"
                            value={tour.priceChildUnder5}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                            placeholder="Giá trẻ em dưới 5 tuổi"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Số Người Tối Đa
                        </label>
                        <input
                            type="number"
                            name="maxGroupSize"
                            value={tour.maxGroupSize}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="1"
                            placeholder="Số người tối đa"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Hình Ảnh (Có thể chọn nhiều)
                        </label>
                        <button
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            onClick={handleAddTourImageFromFile}
                        >
                            Chọn ảnh
                        </button>
                        <input
                            type="file"
                            name="imageFiles"
                            accept="image/jpeg,image/png,image/jpg"
                            multiple
                            onChange={handleTourImageFiles}
                            className="hidden"
                            ref={tourFileInputRef}
                        />
                        <label className="block text-gray-800 font-semibold text-lg mb-2 mt-4">
                            Link ảnh từ bên ngoài
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={tempUrlInput.tour}
                                onChange={(e) =>
                                    setTempUrlInput({
                                        ...tempUrlInput,
                                        tour: e.target.value
                                    })
                                }
                                className="flex-grow border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://picsum.photos/200/300"
                            />
                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                onClick={handleAddTourUrl}
                            >
                                Thêm
                            </button>
                        </div>
                        {tourImages.length > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">
                                        Đã chọn {tourImages.length} ảnh
                                    </span>
                                    <button
                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        onClick={clearTourImages}
                                    >
                                        Xóa Tất Cả Ảnh
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {tourImages.map((img, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={img.preview}
                                                alt={`Tour preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                                                onClick={() =>
                                                    removeTourImage(index)
                                                }
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Mô Tả
                        </label>
                        <textarea
                            name="description"
                            value={tour.description}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="Nhập mô tả tour"
                            rows="4"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Thông Tin Tour
                        </label>
                        <textarea
                            name="tourInfo"
                            value={tour.tourInfo}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="Nhập thông tin tour"
                            rows="4"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Ghi Chú
                        </label>
                        <textarea
                            name="tourNote"
                            value={tour.tourNote}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="Nhập ghi chú tour"
                            rows="4"
                        />
                    </div>
                    {tour.rejectReason && (
                        <div className="md:col-span-2">
                            <label className="block text-gray-800 font-semibold text-lg mb-2">
                                Lý Do Từ Chối
                            </label>
                            <textarea
                                name="rejectReason"
                                value={tour.rejectReason}
                                className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100"
                                placeholder="Lý do từ chối (nếu có)"
                                rows="4"
                                readOnly
                            />
                        </div>
                    )}
                </div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                    Lịch Trình
                </h3>
                {tour.itinerary.map((day, dayIndex) => (
                    <div
                        key={day.itineraryId || dayIndex}
                        className="bg-white rounded-xl shadow-md overflow-hidden w-full"
                    >
                        <div className="flex justify-between items-center w-full p-5 text-left bg-blue-100 hover:bg-blue-200 transition-colors duration-300">
                            <span className="font-semibold text-lg text-blue-900">
                                {day.title || `Ngày ${day.dayNumber}`} (Ngày{' '}
                                {day.dayNumber})
                            </span>
                            <div className="flex items-center">
                                <button
                                    onClick={() => toggleDay(dayIndex)}
                                    className="flex items-center mr-4"
                                >
                                    <span
                                        className={`transition-transform duration-300 ${openDays[dayIndex] ? 'rotate-180' : ''}`}
                                    >
                                        <svg
                                            className="w-6 h-6 text-blue-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </span>
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    onClick={() => removeDay(dayIndex)}
                                >
                                    Xóa Ngày
                                </button>
                            </div>
                        </div>
                        {openDays[dayIndex] && (
                            <div className="p-6 animate-fade-in">
                                <div className="mb-4">
                                    <label className="block text-blue-800 font-semibold mb-2">
                                        Tiêu Đề
                                    </label>
                                    <input
                                        type="text"
                                        value={day.title}
                                        onChange={(e) =>
                                            handleDayChange(
                                                dayIndex,
                                                'title',
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        placeholder={`Tiêu đề ngày ${day.dayNumber}`}
                                    />
                                </div>
                                {day.activities.map(
                                    (activity, activityIndex) => (
                                        <div
                                            key={
                                                activity.attractionId ||
                                                activityIndex
                                            }
                                            className="bg-blue-50 p-4 mt-4 rounded-lg shadow-sm"
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <h5 className="font-medium text-blue-800">
                                                    Hoạt Động{' '}
                                                    {activityIndex + 1}
                                                </h5>
                                                <button
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                    onClick={() =>
                                                        removeActivity(
                                                            dayIndex,
                                                            activityIndex
                                                        )
                                                    }
                                                >
                                                    Xóa Hoạt Động
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Mô Tả Hoạt Động
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            activity.description
                                                        }
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'description',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        placeholder="Mô tả hoạt động"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Chi Tiết Địa Điểm
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            activity.placeDetail
                                                        }
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'placeDetail',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        placeholder="Chi tiết địa điểm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Địa Chỉ
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={activity.address}
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'address',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        placeholder="Địa chỉ hoạt động"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Chi Phí Dự Kiến (VND)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={
                                                            activity.estimatedCost
                                                        }
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'estimatedCost',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                        min="0"
                                                        placeholder="Chi phí dự kiến"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Giờ Bắt Đầu
                                                    </label>
                                                    <TimePicker
                                                        value={
                                                            activity.startTime
                                                        }
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'startTime',
                                                                e
                                                            )
                                                        }
                                                        placeholder="Chọn giờ bắt đầu"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Giờ Kết Thúc
                                                    </label>
                                                    <TimePicker
                                                        value={activity.endTime}
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'endTime',
                                                                e
                                                            )
                                                        }
                                                        placeholder="Chọn giờ kết thúc"
                                                    />
                                                </div>
                                                {/* <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Danh Mục
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            activity.category
                                                        }
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'category',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Ví dụ: Tham quan, Ẩm thực"
                                                    />
                                                </div> */}
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Danh Mục
                                                    </label>
                                                    <select
                                                        value={
                                                            activity.category
                                                        }
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'category',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        {/* Thêm một tùy chọn mặc định không có giá trị */}
                                                        <option
                                                            value=""
                                                            disabled
                                                        >
                                                            Chọn một danh mục
                                                        </option>
                                                        {categories.map(
                                                            (cat) => (
                                                                <option
                                                                    key={cat}
                                                                    value={cat}
                                                                >
                                                                    {cat}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        URL Bản Đồ
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={activity.mapUrl}
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'mapUrl',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="URL bản đồ"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Hình Ảnh Hoạt Động (Chỉ
                                                        chọn 1)
                                                    </label>
                                                    <button
                                                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                        onClick={() =>
                                                            handleAddActivityImageFromFile(
                                                                dayIndex,
                                                                activityIndex
                                                            )
                                                        }
                                                    >
                                                        Chọn ảnh
                                                    </button>
                                                    <input
                                                        type="file"
                                                        name="imageFiles"
                                                        accept="image/jpeg,image/png,image/jpg"
                                                        multiple
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'imageFiles',
                                                                e.target
                                                            )
                                                        }
                                                        className="hidden"
                                                        ref={(el) => {
                                                            const key = `${dayIndex}-${activityIndex}`
                                                            if (
                                                                !activityFileInputRefs
                                                                    .current[
                                                                    key
                                                                ]
                                                            ) {
                                                                activityFileInputRefs.current[
                                                                    key
                                                                ] =
                                                                    React.createRef()
                                                            }
                                                            activityFileInputRefs.current[
                                                                key
                                                            ].current = el
                                                        }}
                                                    />
                                                    <label className="block text-gray-700 font-medium mb-2 mt-4">
                                                        Link ảnh từ bên ngoài
                                                    </label>
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="text"
                                                            value={
                                                                tempUrlInput[
                                                                    `${dayIndex}-${activityIndex}`
                                                                ] || ''
                                                            }
                                                            onChange={(e) =>
                                                                setTempUrlInput(
                                                                    {
                                                                        ...tempUrlInput,
                                                                        [`${dayIndex}-${activityIndex}`]:
                                                                            e
                                                                                .target
                                                                                .value
                                                                    }
                                                                )
                                                            }
                                                            className="flex-grow border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="https://picsum.photos/200/300"
                                                        />
                                                        <button
                                                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                            onClick={() =>
                                                                handleAddActivityUrl(
                                                                    dayIndex,
                                                                    activityIndex
                                                                )
                                                            }
                                                        >
                                                            Thêm
                                                        </button>
                                                    </div>
                                                    {activityImages[
                                                        `${dayIndex}-${activityIndex}`
                                                    ]?.length > 0 && (
                                                        <div className="mt-4">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-gray-700 font-medium">
                                                                    Đã chọn{' '}
                                                                    {
                                                                        activityImages[
                                                                            `${dayIndex}-${activityIndex}`
                                                                        ].length
                                                                    }{' '}
                                                                    ảnh
                                                                </span>
                                                                <button
                                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                                    onClick={() =>
                                                                        clearActivityImages(
                                                                            dayIndex,
                                                                            activityIndex
                                                                        )
                                                                    }
                                                                >
                                                                    Xóa Tất Cả
                                                                    Ảnh
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                {activityImages[
                                                                    `${dayIndex}-${activityIndex}`
                                                                ].map(
                                                                    (
                                                                        img,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="relative"
                                                                        >
                                                                            <img
                                                                                src={
                                                                                    img.preview
                                                                                }
                                                                                alt={`Activity preview ${index + 1}`}
                                                                                className="w-full h-24 object-cover rounded-lg"
                                                                            />
                                                                            <button
                                                                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                                                                                onClick={() =>
                                                                                    removeActivityImage(
                                                                                        dayIndex,
                                                                                        activityIndex,
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >
                                                                                X
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                                <button
                                    className="mt-4 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md flex items-center"
                                    onClick={() => addActivity(dayIndex)}
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    Thêm Hoạt Động
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                <div className="mt-4 space-y-4">
                    <div className="flex">
                        <button
                            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md flex items-center"
                            onClick={addDay}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Thêm Ngày
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md flex items-center"
                            onClick={handleUpdate}
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Cập Nhật Tour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index
