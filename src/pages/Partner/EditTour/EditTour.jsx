import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import partnerTourAPI from '@/apis/partnerTourAPI'
import Swal from 'sweetalert2'

const EditTour = () => {
    const { tourId } = useParams()
    const [tour, setTour] = useState(null)
    const [tourImageList, setTourImageList] = useState([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [openDays, setOpenDays] = useState({})
    const [imagePreviews, setImagePreviews] = useState([])
    const [activityPreviews, setActivityPreviews] = useState({})
    const [newImageUrls, setNewImageUrls] = useState([])
    const [newActivityImageUrls, setNewActivityImageUrls] = useState({})
    const [selectedTourImageIds, setSelectedTourImageIds] = useState([])
    const [selectedActivityImageIds, setSelectedActivityImageIds] = useState({})
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()

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
        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [])

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
                console.log('Fetch tour response:', tourData)

                // ✅ Gộp imageUrls + imageIds thành tourImageList
                const imageUrls = tourData.imageUrls || []
                const imageIds = tourData.imageIds || []
                const imageList = imageUrls.map((url, index) => ({
                    url,
                    id: imageIds[index] || null
                }))
                setTourImageList(imageList) // <-- Thêm dòng này
                setImagePreviews(imageUrls) // Nếu bạn còn dùng cho preview khác

                // ✅ Set tour dữ liệu
                setTour({
                    tourName: tourData.tourName || '',
                    description: tourData.description || '',
                    duration: tourData.days?.toString() || '1',
                    price: tourData.totalEstimatedCost || 0,
                    pricePerDay: tourData.pricePerDay || 0,
                    location: tourData.location || '',
                    maxGroupSize: tourData.maxGroupSize || 1,
                    category: tourData.preferences || '',
                    tourNote: tourData.tourNote || '',
                    tourInfo: tourData.tourInfo || '',
                    status: tourData.status || 'Draft',
                    rejectReason: tourData.rejectReason || '',
                    imageUrls,
                    imageIds,
                    imageFiles: [],
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
                                    imageUrls: act.imageUrls || [],
                                    imageIds: act.imageIds || [],
                                    imageFiles: []
                                })) || []
                        })) || []
                })

                // ✅ Hoạt động preview
                setActivityPreviews(
                    tourData.itinerary?.reduce(
                        (acc, day, dayIndex) => ({
                            ...acc,
                            ...day.activities.reduce(
                                (actAcc, act, actIndex) => ({
                                    ...actAcc,
                                    [`${dayIndex}-${actIndex}`]:
                                        act.imageUrls || []
                                }),
                                {}
                            )
                        }),
                        {}
                    ) || {}
                )
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
        const { name, value, files } = e.target
        if (name === 'imageFiles') {
            // Loại bỏ tệp trùng lặp dựa trên tên tệp
            const uniqueFiles = Array.from(files).filter(
                (file, index, self) =>
                    file.type.startsWith('image/') &&
                    file.size <= 10 * 1024 * 1024 && // Giới hạn 10MB
                    self.findIndex((f) => f.name === file.name) === index
            )
            if (uniqueFiles.length !== files.length) {
                setError(
                    'Chỉ chấp nhận tệp hình ảnh không trùng lặp và dưới 10MB.'
                )
            }
            setTour({
                ...tour,
                imageFiles: uniqueFiles,
                imageUrls: tour.imageUrls // Giữ lại các URL hiện có
            })
            const previews = uniqueFiles.map((file) =>
                URL.createObjectURL(file)
            )
            setImagePreviews([...tour.imageUrls, ...previews])
            setNewImageUrls([]) // Xóa các URL mới khi chọn file
            console.log(
                'Tour imageFiles selected:',
                uniqueFiles.map((f) => ({ name: f.name, size: f.size }))
            )
        } else if (name === 'imageUrls') {
            const urls = value
                .split(',')
                .map((url) => url.trim())
                .filter((url, index, self) => {
                    try {
                        new URL(url)
                        return (
                            !tour.imageUrls.includes(url) &&
                            self.indexOf(url) === index // Loại bỏ URL trùng lặp
                        )
                    } catch {
                        return false
                    }
                })
            if (
                urls.length !==
                value.split(',').filter((url) => url.trim()).length
            ) {
                setError('Một số URL hình ảnh không hợp lệ hoặc trùng lặp.')
            }
            setTour({
                ...tour,
                imageFiles: [], // Xóa các file khi thêm URL
                imageUrls: tour.imageUrls // Giữ lại các URL hiện có
            })
            setNewImageUrls(urls)
            setImagePreviews([...tour.imageUrls, ...urls])
            console.log('Tour newImageUrls entered:', urls)
        } else {
            const newValue =
                name === 'price' ||
                name === 'maxGroupSize' ||
                name === 'pricePerDay'
                    ? parseFloat(value) || 0
                    : value
            setTour({ ...tour, [name]: newValue })
            console.log(`Tour field updated: ${name} = ${newValue}`)
        }
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
            // Loại bỏ tệp trùng lặp dựa trên tên tệp
            const uniqueFiles = Array.from(value.files).filter(
                (file, index, self) =>
                    file.type.startsWith('image/') &&
                    file.size <= 10 * 1024 * 1024 &&
                    self.findIndex((f) => f.name === file.name) === index
            )
            console.log(
                `Selected image files for day ${dayIndex + 1}, activity ${activityIndex + 1}:`,
                uniqueFiles.map((f) => ({ name: f.name, size: f.size }))
            )
            if (uniqueFiles.length !== value.files.length) {
                setError(
                    'Chỉ chấp nhận tệp hình ảnh không trùng lặp và dưới 10MB cho hoạt động.'
                )
            }
            newItinerary[dayIndex].activities[activityIndex].imageFiles =
                uniqueFiles

            setTour({ ...tour, itinerary: newItinerary })
            const previews = uniqueFiles.map((file) =>
                URL.createObjectURL(file)
            )
            setActivityPreviews((prev) => ({
                ...prev,
                [`${dayIndex}-${activityIndex}`]: [
                    ...newItinerary[dayIndex].activities[activityIndex]
                        .imageUrls,
                    ...previews
                ]
            }))
            setNewActivityImageUrls((prev) => ({
                ...prev,
                [`${dayIndex}-${activityIndex}`]: []
            }))
        } else if (field === 'imageUrls') {
            const urls = value
                .split(',')
                .map((url) => url.trim())
                .filter((url, index, self) => {
                    try {
                        new URL(url)
                        return (
                            !newItinerary[dayIndex].activities[
                                activityIndex
                            ].imageUrls.includes(url) &&
                            self.indexOf(url) === index // Loại bỏ URL trùng lặp
                        )
                    } catch {
                        return false
                    }
                })
            console.log(
                `Entered image URLs for day ${dayIndex + 1}, activity ${activityIndex + 1}:`,
                urls
            )
            if (
                urls.length !==
                value.split(',').filter((url) => url.trim()).length
            ) {
                setError(
                    `Một số URL hình ảnh không hợp lệ hoặc trùng lặp cho hoạt động ngày ${dayIndex + 1}.`
                )
            }
            newItinerary[dayIndex].activities[activityIndex].imageFiles = []
            setTour({ ...tour, itinerary: newItinerary })
            setNewActivityImageUrls((prev) => ({
                ...prev,
                [`${dayIndex}-${activityIndex}`]: urls
            }))
            setActivityPreviews((prev) => ({
                ...prev,
                [`${dayIndex}-${activityIndex}`]: [
                    ...newItinerary[dayIndex].activities[activityIndex]
                        .imageUrls,
                    ...urls
                ]
            }))
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
        setActivityPreviews((prev) => ({
            ...prev,
            [`${newItinerary.length - 1}-0`]: []
        }))
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
        setActivityPreviews((prev) => {
            const updatedPreviews = { ...prev }
            Object.keys(updatedPreviews).forEach((key) => {
                if (key.startsWith(`${dayIndex}-`)) {
                    delete updatedPreviews[key]
                }
            })
            return updatedPreviews
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
        setActivityPreviews((prev) => ({
            ...prev,
            [`${dayIndex}-${newItinerary[dayIndex].activities.length - 1}`]: []
        }))
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
        setActivityPreviews((prev) => {
            const updatedPreviews = { ...prev }
            delete updatedPreviews[`${dayIndex}-${activityIndex}`]
            return updatedPreviews
        })
        console.log(
            `Removed activity ${activityIndex + 1} from day ${dayIndex + 1}`
        )
    }

    const handleSelectTourImage = (imageId) => {
        setSelectedTourImageIds((prev) =>
            prev.includes(imageId)
                ? prev.filter((id) => id !== imageId)
                : [...prev, imageId]
        )
    }

    const handleSelectActivityImage = (dayIndex, activityIndex, imageId) => {
        setSelectedActivityImageIds((prev) => {
            const key = `${dayIndex}-${activityIndex}`
            const current = prev[key] || []
            return {
                ...prev,
                [key]: current.includes(imageId)
                    ? current.filter((id) => id !== imageId)
                    : [...current, imageId]
            }
        })
    }

    const deleteMultipleTourImages = async () => {
        if (selectedTourImageIds.length === 0) {
            setError('Vui lòng chọn ít nhất một hình ảnh để xóa.')
            return
        }
        try {
            console.log(
                `Deleting multiple tour images with IDs: ${selectedTourImageIds.join(', ')}`
            )
            await partnerTourAPI.deleteMultipleTourImages(selectedTourImageIds)
            const newImageUrls = tour.imageUrls.filter(
                (_, index) =>
                    !selectedTourImageIds.includes(tour.imageIds[index])
            )
            const newImageIds = tour.imageIds.filter(
                (id) => !selectedTourImageIds.includes(id)
            )
            setTour({
                ...tour,
                imageUrls: newImageUrls,
                imageIds: newImageIds
            })
            setImagePreviews(newImageUrls)
            setSelectedTourImageIds([])
            Swal.fire({
                icon: 'success',
                text: 'Xóa các hình ảnh tour thành công!',
                showConfirmButton: false,
                timer: 1800
            })
        } catch (err) {
            setError('Không thể xóa các hình ảnh. Vui lòng thử lại.')
            console.error('API Error (deleteMultipleTourImages):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
            })
        }
    }

    const deleteMultipleActivityImages = async (dayIndex, activityIndex) => {
        const key = `${dayIndex}-${activityIndex}`
        const imageIds = selectedActivityImageIds[key] || []
        if (imageIds.length === 0) {
            setError('Vui lòng chọn ít nhất một hình ảnh hoạt động để xóa.')
            return
        }
        try {
            console.log(
                `Deleting multiple activity images with IDs: ${imageIds.join(', ')}`
            )
            await partnerTourAPI.deleteMultipleActivityImages(imageIds)
            const newItinerary = [...tour.itinerary]
            const newImageUrls = newItinerary[dayIndex].activities[
                activityIndex
            ].imageUrls.filter(
                (_, index) =>
                    !imageIds.includes(
                        newItinerary[dayIndex].activities[activityIndex]
                            .imageIds[index]
                    )
            )
            const newImageIds = newItinerary[dayIndex].activities[
                activityIndex
            ].imageIds.filter((id) => !imageIds.includes(id))
            newItinerary[dayIndex].activities[activityIndex].imageUrls =
                newImageUrls
            newItinerary[dayIndex].activities[activityIndex].imageIds =
                newImageIds
            setTour({ ...tour, itinerary: newItinerary })
            setActivityPreviews((prev) => ({
                ...prev,
                [key]: newImageUrls
            }))
            setSelectedActivityImageIds((prev) => ({
                ...prev,
                [key]: []
            }))
            Swal.fire({
                icon: 'success',
                text: 'Xóa các hình ảnh hoạt động thành công!',
                showConfirmButton: false,
                timer: 1800
            })
        } catch (err) {
            setError('Không thể xóa các hình ảnh hoạt động. Vui lòng thử lại.')
            console.error('API Error (deleteMultipleActivityImages):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
            })
        }
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
        if (isNaN(tour.pricePerDay) || tour.pricePerDay < 0)
            return 'Giá mỗi ngày không được âm.'
        if (isNaN(tour.maxGroupSize) || tour.maxGroupSize <= 0)
            return 'Số người tối đa phải lớn hơn 0.'
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
            }
        }
        return ''
    }

    const handleUpdate = async () => {
        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            console.error('Validation error:', validationError)
            return
        }

        try {
            const formData = new FormData()
            formData.append('TourName', tour.tourName)
            formData.append('Description', tour.description)
            formData.append('Duration', parseInt(tour.duration) || 1)
            formData.append('Price', parseFloat(tour.price) || 0)
            formData.append('PricePerDay', parseFloat(tour.pricePerDay) || 0)
            formData.append('Location', tour.location)
            formData.append('MaxGroupSize', parseInt(tour.maxGroupSize) || 1)
            formData.append('Category', tour.category)
            formData.append('TourNote', tour.tourNote || '')
            formData.append('TourInfo', tour.tourInfo || '')

            if (tour.imageFiles.length > 0) {
                tour.imageFiles.forEach((file, index) => {
                    formData.append(`imageFiles[${index}]`, file)
                })
                console.log(
                    'Sending imageFiles:',
                    tour.imageFiles.map((f) => f.name)
                )
            } else {
                console.log('No imageFiles to send')
            }
            if (newImageUrls.length > 0) {
                newImageUrls.forEach((url, index) => {
                    formData.append(`imageUrls[${index}]`, url)
                })
                console.log('Sending imageUrls:', newImageUrls)
            } else {
                console.log('No imageUrls to send')
            }

            console.log(
                'Tour FormData for update:',
                Array.from(formData.entries())
            )

            const updateTourResponse = await partnerTourAPI.updateTour(
                tourId,
                formData
            )
            console.log('Update tour response:', updateTourResponse.data)

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
                if (day.itineraryId) {
                    console.log(
                        `Updating itinerary with ID: ${day.itineraryId}`,
                        itineraryPayload
                    )
                    const updateItineraryResponse =
                        await partnerTourAPI.updateItinerary(
                            day.itineraryId,
                            itineraryPayload
                        )
                    console.log(
                        `Update itinerary response for day ${day.dayNumber}:`,
                        updateItineraryResponse.data
                    )
                } else {
                    console.log(
                        `Creating new itinerary for day ${day.dayNumber}:`,
                        itineraryPayload
                    )
                    const createItineraryResponse =
                        await partnerTourAPI.createItinerary(
                            tourId,
                            itineraryPayload
                        )
                    console.log(
                        `Create itinerary response for day ${day.dayNumber}:`,
                        createItineraryResponse.data
                    )
                    newItinerary[dayIndex].itineraryId =
                        createItineraryResponse.data.data
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

                    if (activity.imageFiles.length > 0) {
                        activity.imageFiles.forEach((file, index) => {
                            activityFormData.append(
                                `imageFiles[${index}]`,
                                file
                            )
                        })
                        console.log(
                            `Sending imageFiles for activity ${activityIndex + 1} (Day ${day.dayNumber}):`,
                            activity.imageFiles.map((f) => f.name)
                        )
                    } else {
                        console.log(
                            `No imageFiles for activity ${activityIndex + 1} (Day ${day.dayNumber})`
                        )
                    }
                    if (
                        newActivityImageUrls[`${dayIndex}-${activityIndex}`]
                            ?.length > 0
                    ) {
                        newActivityImageUrls[
                            `${dayIndex}-${activityIndex}`
                        ].forEach((url, index) => {
                            activityFormData.append(`imageUrls[${index}]`, url)
                        })
                        console.log(
                            `Sending imageUrls for activity ${activityIndex + 1} (Day ${day.dayNumber}):`,
                            newActivityImageUrls[`${dayIndex}-${activityIndex}`]
                        )
                    } else {
                        console.log(
                            `No imageUrls for activity ${activityIndex + 1} (Day ${day.dayNumber})`
                        )
                    }

                    console.log(
                        `Activity FormData for day ${day.dayNumber}, activity ${activityIndex + 1}:`,
                        Array.from(activityFormData.entries())
                    )

                    if (activity.attractionId) {
                        console.log(
                            `Updating activity with ID: ${activity.attractionId}`
                        )
                        const updateActivityResponse =
                            await partnerTourAPI.updateActivity(
                                activity.attractionId,
                                activityFormData
                            )
                        console.log(
                            `Update activity response for day ${day.dayNumber}, activity ${activityIndex + 1}:`,
                            updateActivityResponse.data
                        )
                        newItinerary[dayIndex].activities[
                            activityIndex
                        ].imageUrls =
                            updateActivityResponse.data.imageUrls ||
                            newItinerary[dayIndex].activities[activityIndex]
                                .imageUrls ||
                            []
                        newItinerary[dayIndex].activities[
                            activityIndex
                        ].imageIds =
                            updateActivityResponse.data.imageIds ||
                            newItinerary[dayIndex].activities[activityIndex]
                                .imageIds ||
                            []
                    } else {
                        console.log(
                            `Creating new activity for day ${day.dayNumber}, activity ${activityIndex + 1}`
                        )
                        const createActivityResponse =
                            await partnerTourAPI.createActivity(
                                newItinerary[dayIndex].itineraryId,
                                activityFormData
                            )
                        console.log(
                            `Create activity response for day ${day.dayNumber}, activity ${activityIndex + 1}:`,
                            createActivityResponse.data
                        )
                        newItinerary[dayIndex].activities[
                            activityIndex
                        ].attractionId = createActivityResponse.data.data
                        newItinerary[dayIndex].activities[
                            activityIndex
                        ].imageUrls =
                            createActivityResponse.data.imageUrls ||
                            newItinerary[dayIndex].activities[activityIndex]
                                .imageUrls ||
                            []
                        newItinerary[dayIndex].activities[
                            activityIndex
                        ].imageIds =
                            createActivityResponse.data.imageIds ||
                            newItinerary[dayIndex].activities[activityIndex]
                                .imageIds ||
                            []
                    }
                }
            }

            // Làm mới dữ liệu từ API để đồng bộ
            const updatedTourResponse =
                await partnerTourAPI.getTourDetail(tourId)
            console.log('Refreshed tour data:', updatedTourResponse.data)
            const updatedTourData = updatedTourResponse.data
            if (
                !updatedTourData.imageUrls ||
                updatedTourData.imageUrls.length === 0
            ) {
                console.warn('No imageUrls returned from getTourDetail API')
                setError(
                    'Không tìm thấy ảnh sau khi cập nhật. Vui lòng kiểm tra lại.'
                )
            }
            if (
                !updatedTourData.imageIds ||
                updatedTourData.imageIds.length === 0
            ) {
                console.warn('No imageIds returned from getTourDetail API')
            }
            setTour({
                ...tour,
                imageUrls: updatedTourData.imageUrls || [],
                imageIds: updatedTourData.imageIds || [], // Xử lý imageIds undefined
                itinerary:
                    updatedTourData.itinerary?.map((day) => ({
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
                                imageUrls: act.imageUrls || [],
                                imageIds: act.imageIds || [], // Xử lý imageIds undefined
                                imageFiles: []
                            })) || []
                    })) || []
            })
            setImagePreviews(updatedTourData.imageUrls || [])
            setActivityPreviews(
                updatedTourData.itinerary?.reduce(
                    (acc, day, dayIndex) => ({
                        ...acc,
                        ...day.activities.reduce(
                            (actAcc, act, actIndex) => ({
                                ...actAcc,
                                [`${dayIndex}-${actIndex}`]: act.imageUrls || []
                            }),
                            {}
                        )
                    }),
                    {}
                ) || {}
            )
            setNewImageUrls([])
            setNewActivityImageUrls({})
            setSelectedTourImageIds([])
            setSelectedActivityImageIds({})

            Swal.fire({
                icon: 'success',
                text: 'Cập nhật tour thành công!',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/partner/listTour')
        } catch (err) {
            console.error('API Error (updateTour):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
            })
            let errorMessage = 'Không thể cập nhật tour. Vui lòng thử lại.'
            if (err.response?.data?.errors) {
                errorMessage = Array.isArray(err.response.data.errors)
                    ? err.response.data.errors.join(', ')
                    : typeof err.response.data.errors === 'string'
                      ? err.response.data.errors
                      : JSON.stringify(err.response.data.errors)
            }
            setError(errorMessage)
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
                    <div>
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
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Thời Gian (ngày)
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
                    <div>
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
                            Giá Mỗi Ngày (VND)
                        </label>
                        <input
                            type="number"
                            name="pricePerDay"
                            value={tour.pricePerDay}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                            placeholder="Giá mỗi ngày"
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
                            Hình Ảnh Tour
                        </label>
                        <input
                            type="file"
                            name="imageFiles"
                            accept="image/*"
                            multiple
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg"
                        />
                        {imagePreviews.length > 0 && (
                            <div className="mt-2">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Hình Ảnh Hiện Có và Mới
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tourImageList.map((img, index) => (
                                        <div
                                            key={img.id || index}
                                            className="relative"
                                        >
                                            {img.id && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTourImageIds.includes(
                                                        img.id
                                                    )}
                                                    onChange={() =>
                                                        handleSelectTourImage(
                                                            img.id
                                                        )
                                                    }
                                                    className="absolute top-1 left-1"
                                                />
                                            )}
                                            <img
                                                src={img.url}
                                                alt={`Tour Image ${index}`}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        </div>
                                    ))}
                                </div>
                                {selectedTourImageIds.length > 0 && (
                                    <button
                                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        onClick={deleteMultipleTourImages}
                                    >
                                        Xóa các hình ảnh đã chọn
                                    </button>
                                )}
                            </div>
                        )}
                        <input
                            type="text"
                            name="imageUrls"
                            value={newImageUrls.join(',')}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nhập các URL hình ảnh mới, cách nhau bằng dấu phẩy"
                        />
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
                                        className={`transition-transform duration-300 ${
                                            openDays[dayIndex]
                                                ? 'rotate-180'
                                                : ''
                                        }`}
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
                                                        Thời Gian Bắt Đầu
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={
                                                            activity.startTime
                                                        }
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'startTime',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Thời gian bắt đầu"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Thời Gian Kết Thúc
                                                    </label>
                                                    <input
                                                        type="time"
                                                        value={activity.endTime}
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'endTime',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Thời gian kết thúc"
                                                    />
                                                </div>
                                                <div>
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
                                                        Hình Ảnh Hoạt Động
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'imageFiles',
                                                                e.target
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg"
                                                    />
                                                    {activityPreviews[
                                                        `${dayIndex}-${activityIndex}`
                                                    ]?.length > 0 && (
                                                        <div className="mt-2">
                                                            <label className="block text-gray-700 font-medium mb-2">
                                                                Hình Ảnh Hiện Có
                                                                và Mới
                                                            </label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {activityPreviews[
                                                                    `${dayIndex}-${activityIndex}`
                                                                ].map(
                                                                    (
                                                                        url,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="relative"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedActivityImageIds[
                                                                                    `${dayIndex}-${activityIndex}`
                                                                                ]?.includes(
                                                                                    activity
                                                                                        .imageIds[
                                                                                        index
                                                                                    ]
                                                                                )}
                                                                                onChange={() =>
                                                                                    handleSelectActivityImage(
                                                                                        dayIndex,
                                                                                        activityIndex,
                                                                                        activity
                                                                                            .imageIds[
                                                                                            index
                                                                                        ]
                                                                                    )
                                                                                }
                                                                                className="absolute top-1 left-1"
                                                                                disabled={
                                                                                    !activity
                                                                                        .imageIds[
                                                                                        index
                                                                                    ]
                                                                                }
                                                                            />
                                                                            <img
                                                                                src={
                                                                                    url
                                                                                }
                                                                                alt={`Activity Image ${index}`}
                                                                                className="w-24 h-24 object-cover rounded-lg"
                                                                                onError={() =>
                                                                                    console.error(
                                                                                        `Failed to load activity image preview ${index + 1}: ${url}`
                                                                                    )
                                                                                }
                                                                            />
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                            {selectedActivityImageIds[
                                                                `${dayIndex}-${activityIndex}`
                                                            ]?.length > 0 && (
                                                                <button
                                                                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                                    onClick={() =>
                                                                        deleteMultipleActivityImages(
                                                                            dayIndex,
                                                                            activityIndex
                                                                        )
                                                                    }
                                                                >
                                                                    Xóa các hình
                                                                    ảnh đã chọn
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                    <input
                                                        type="text"
                                                        value={(
                                                            newActivityImageUrls[
                                                                `${dayIndex}-${activityIndex}`
                                                            ] || []
                                                        ).join(',')}
                                                        onChange={(e) =>
                                                            handleActivityChange(
                                                                dayIndex,
                                                                activityIndex,
                                                                'imageUrls',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full border border-gray-300 p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Nhập các URL hình ảnh mới, cách nhau bằng dấu phẩy"
                                                    />
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

export default EditTour
