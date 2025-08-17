import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import partnerTourAPI from '@/apis/partnerTourAPI'
import Swal from 'sweetalert2'
import TimePicker from '@/components/ui/TimePicker'

const CreateTour = () => {
    const [tour, setTour] = useState({
        tourName: '',
        description: '',
        duration: '1',
        priceAdult: 0,
        priceChild5To10: 0,
        priceChildUnder5: 0,
        location: '',
        maxGroupSize: 1,
        category: '',
        tourNote: '',
        tourInfo: '',
        tourTypesID: 2,
        startTime: '',
        imageFiles: [],
        imageUrls: [],
        imageIds: [],
        itinerary: [
            {
                dayNumber: 1,
                title: '',
                itineraryId: null,
                activities: [
                    {
                        placeDetail: '',
                        description: '',
                        address: '',
                        estimatedCost: 0,
                        startTime: '',
                        endTime: '',
                        mapUrl: '',
                        category: '',
                        imageFiles: [],
                        imageUrls: [],
                        imageIds: [],
                        attractionId: null
                    }
                ]
            }
        ]
    })
    const [openDays, setOpenDays] = useState({ 0: true })
    const [imagePreviews, setImagePreviews] = useState([])
    const [activityPreviews, setActivityPreviews] = useState({})
    const [tempUrlInput, setTempUrlInput] = useState({ tour: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const tourFileInputRef = useRef(null)
    const activityFileInputRefs = useRef({})
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const MAX_IMAGES = 20

    useEffect(() => {
        if (!isAuthLoading && !isLoggedIn) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng đăng nhập để tạo tour.',
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
            imagePreviews.forEach((url) => URL.revokeObjectURL(url))
            Object.values(activityPreviews)
                .flat()
                .forEach((url) => URL.revokeObjectURL(url))
        }
    }, [imagePreviews, activityPreviews])

    const handleTourChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'imageFiles') {
            const validFiles = Array.from(files).filter((file) =>
                ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
            )
            if (validFiles.length !== files.length) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Chỉ chấp nhận tệp hình ảnh (jpg, jpeg, png).',
                    showConfirmButton: false,
                    timer: 1800
                })
                return
            }
            if (
                tour.imageFiles.length +
                    validFiles.length +
                    tour.imageUrls.length >
                MAX_IMAGES
            ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: `Tổng số ảnh (file và URL) không được vượt quá ${MAX_IMAGES}.`,
                    showConfirmButton: false,
                    timer: 1800
                })
                return
            }
            setTour((prev) => ({
                ...prev,
                imageFiles: [...prev.imageFiles, ...validFiles],
                imageIds: []
            }))
            const previews = validFiles.map((file) => URL.createObjectURL(file))
            setImagePreviews((prev) => [...prev, ...previews])
            console.log(
                'Tour imageFiles added:',
                validFiles.map((f) => ({ name: f.name, size: f.size }))
            )
        } else if (name === 'duration') {
            // Cho phép giá trị rỗng tạm thời khi người dùng xóa
            if (value === '') {
                setTour((prev) => ({ ...prev, duration: '' }))
                return
            }
            const newDuration = parseInt(value)
            if (isNaN(newDuration) || newDuration < 1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Số ngày phải lớn hơn hoặc bằng 1.',
                    showConfirmButton: false,
                    timer: 1800
                })
                return
            }
            setTour((prev) => {
                let newItinerary = [...prev.itinerary]
                const currentDays = newItinerary.length

                if (newDuration > currentDays) {
                    // Thêm ngày mới
                    const daysToAdd = newDuration - currentDays
                    const newDays = Array.from(
                        { length: daysToAdd },
                        (_, i) => ({
                            dayNumber: currentDays + i + 1,
                            title: '',
                            itineraryId: null,
                            activities: [
                                {
                                    placeDetail: '',
                                    description: '',
                                    address: '',
                                    estimatedCost: 0,
                                    startTime: '',
                                    endTime: '',
                                    mapUrl: '',
                                    category: '',
                                    imageFiles: [],
                                    imageUrls: [],
                                    imageIds: [],
                                    attractionId: null
                                }
                            ]
                        })
                    )
                    newItinerary = [...newItinerary, ...newDays]
                    setOpenDays((prevOpenDays) => {
                        const newOpenDays = { ...prevOpenDays }
                        newDays.forEach((_, i) => {
                            newOpenDays[currentDays + i] = true
                        })
                        return newOpenDays
                    })
                } else if (newDuration < currentDays) {
                    // Xóa các ngày thừa
                    newItinerary = newItinerary.slice(0, newDuration)
                    setOpenDays((prevOpenDays) => {
                        const newOpenDays = {}
                        for (let i = 0; i < newDuration; i++) {
                            if (prevOpenDays[i] !== undefined) {
                                newOpenDays[i] = prevOpenDays[i]
                            }
                        }
                        return newOpenDays
                    })
                    setActivityPreviews((prevPreviews) => {
                        const newPreviews = {}
                        Object.keys(prevPreviews).forEach((key) => {
                            const [dayIndex] = key.split('-').map(Number)
                            if (dayIndex < newDuration) {
                                newPreviews[key] = prevPreviews[key]
                            }
                        })
                        return newPreviews
                    })
                    setTempUrlInput((prevTemp) => {
                        const newTemp = { tour: prevTemp.tour }
                        Object.keys(prevTemp).forEach((key) => {
                            if (key !== 'tour') {
                                const [dayIndex] = key.split('-').map(Number)
                                if (dayIndex < newDuration) {
                                    newTemp[key] = prevTemp[key]
                                }
                            }
                        })
                        return newTemp
                    })
                }

                // Cập nhật dayNumber cho tất cả các ngày
                newItinerary.forEach((day, index) => {
                    day.dayNumber = index + 1
                })

                return {
                    ...prev,
                    duration: value,
                    itinerary: newItinerary
                }
            })
        } else {
            const newValue =
                name === 'priceAdult' ||
                name === 'priceChild5To10' ||
                name === 'priceChildUnder5' ||
                name === 'maxGroupSize'
                    ? parseFloat(value) || 0
                    : value
            setTour({ ...tour, [name]: newValue })
        }
    }

    const handleAddTourUrl = () => {
        const value = tempUrlInput.tour
        const urls = value
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url && url.length > 0)
        if (
            tour.imageFiles.length + tour.imageUrls.length + urls.length >
            MAX_IMAGES
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: `Tổng số ảnh (file và URL) không được vượt quá ${MAX_IMAGES}.`,
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        setTour((prev) => ({
            ...prev,
            imageUrls: [...prev.imageUrls, ...urls],
            imageIds: []
        }))
        setImagePreviews((prev) => [...prev, ...urls])
        setTempUrlInput((prev) => ({ ...prev, tour: '' }))
        console.log('Tour imageUrls added:', urls)
    }

    const handleActivityChange = (dayIndex, activityIndex, field, value) => {
        const newItinerary = [...tour.itinerary]
        if (field === 'imageFiles') {
            const validFiles = Array.from(value.files).filter((file) =>
                ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
            )
            if (validFiles.length !== value.files.length) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Chỉ chấp nhận tệp hình ảnh (jpg, jpeg, png) cho hoạt động.',
                    showConfirmButton: false,
                    timer: 1800
                })
                return
            }
            const currentFiles =
                newItinerary[dayIndex].activities[activityIndex].imageFiles ||
                []
            const currentUrls =
                newItinerary[dayIndex].activities[activityIndex].imageUrls || []
            if (
                currentFiles.length + validFiles.length + currentUrls.length >
                MAX_IMAGES
            ) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: `Tổng số ảnh (file và URL) không được vượt quá ${MAX_IMAGES} cho hoạt động.`,
                    showConfirmButton: false,
                    timer: 1800
                })
                return
            }
            newItinerary[dayIndex].activities[activityIndex].imageFiles = [
                ...currentFiles,
                ...validFiles
            ]
            newItinerary[dayIndex].activities[activityIndex].imageIds = []
            setTour({ ...tour, itinerary: newItinerary })
            const previews = validFiles.map((file) => URL.createObjectURL(file))
            setActivityPreviews((prev) => ({
                ...prev,
                [`${dayIndex}-${activityIndex}`]: [
                    ...(prev[`${dayIndex}-${activityIndex}`] || []),
                    ...previews
                ]
            }))
        } else {
            const newValue =
                field === 'estimatedCost' ? parseFloat(value) || 0 : value
            newItinerary[dayIndex].activities[activityIndex] = {
                ...newItinerary[dayIndex].activities[activityIndex],
                [field]: newValue
            }
            setTour({ ...tour, itinerary: newItinerary })
        }
    }

    const handleAddActivityUrl = (dayIndex, activityIndex) => {
        const key = `${dayIndex}-${activityIndex}`
        const value = tempUrlInput[key] || ''
        const urls = value
            .split(',')
            .map((url) => url.trim())
            .filter((url) => url && url.length > 0)
        if (urls.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng nhập ít nhất một URL ảnh hợp lệ.',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        const newItinerary = [...tour.itinerary]
        const currentFiles =
            newItinerary[dayIndex].activities[activityIndex].imageFiles || []
        const currentUrls =
            newItinerary[dayIndex].activities[activityIndex].imageUrls || []
        if (
            currentFiles.length + currentUrls.length + urls.length >
            MAX_IMAGES
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: `Tổng số ảnh (file và URL) không được vượt quá ${MAX_IMAGES} cho hoạt động.`,
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        newItinerary[dayIndex].activities[activityIndex].imageUrls = [
            ...currentUrls,
            ...urls
        ]
        newItinerary[dayIndex].activities[activityIndex].imageIds = []
        setTour({ ...tour, itinerary: newItinerary })
        setActivityPreviews((prev) => ({
            ...prev,
            [key]: [...(prev[key] || []), ...urls]
        }))
        setTempUrlInput((prev) => ({
            ...prev,
            [key]: ''
        }))
    }

    const handleDayChange = (dayIndex, field, value) => {
        const newItinerary = [...tour.itinerary]
        newItinerary[dayIndex] = {
            ...newItinerary[dayIndex],
            [field]: value
        }
        setTour({ ...tour, itinerary: newItinerary })
    }

    const removeTourImage = (index) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index))
        setTour((prev) => ({
            ...prev,
            imageFiles: prev.imageFiles.filter((_, i) =>
                i < prev.imageUrls.length
                    ? true
                    : i !== index - prev.imageUrls.length
            ),
            imageUrls: prev.imageUrls.filter((_, i) =>
                i >= prev.imageUrls.length ? true : i !== index
            ),
            imageIds: []
        }))
    }

    const clearTourImages = () => {
        setImagePreviews([])
        setTour((prev) => ({
            ...prev,
            imageFiles: [],
            imageUrls: [],
            imageIds: []
        }))
        setTempUrlInput((prev) => ({ ...prev, tour: '' }))
    }

    const removeActivityImage = (dayIndex, activityIndex, index) => {
        const newItinerary = [...tour.itinerary]
        const currentUrls =
            newItinerary[dayIndex].activities[activityIndex].imageUrls
        const newPreviews = activityPreviews[
            `${dayIndex}-${activityIndex}`
        ].filter((_, i) => i !== index)
        newItinerary[dayIndex].activities[activityIndex].imageFiles =
            newItinerary[dayIndex].activities[activityIndex].imageFiles.filter(
                (_, i) =>
                    i < currentUrls.length
                        ? true
                        : i !== index - currentUrls.length
            )
        newItinerary[dayIndex].activities[activityIndex].imageUrls =
            newItinerary[dayIndex].activities[activityIndex].imageUrls.filter(
                (_, i) => (i >= currentUrls.length ? true : i !== index)
            )
        newItinerary[dayIndex].activities[activityIndex].imageIds = []
        setTour({ ...tour, itinerary: newItinerary })
        setActivityPreviews((prev) => ({
            ...prev,
            [`${dayIndex}-${activityIndex}`]: newPreviews
        }))
    }

    const clearActivityImages = (dayIndex, activityIndex) => {
        const newItinerary = [...tour.itinerary]
        newItinerary[dayIndex].activities[activityIndex].imageFiles = []
        newItinerary[dayIndex].activities[activityIndex].imageUrls = []
        newItinerary[dayIndex].activities[activityIndex].imageIds = []
        setTour({ ...tour, itinerary: newItinerary })
        setActivityPreviews((prev) => ({
            ...prev,
            [`${dayIndex}-${activityIndex}`]: []
        }))
        setTempUrlInput((prev) => ({
            ...prev,
            [`${dayIndex}-${activityIndex}`]: ''
        }))
    }

    const addDay = () => {
        const newDayIndex = tour.itinerary.length
        const duration = parseInt(tour.duration) || 1
        if (newDayIndex + 1 > duration) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: `Số ngày trong lịch trình không được vượt quá số ngày của tour (${duration} ngày).`,
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        setTour({
            ...tour,
            itinerary: [
                ...tour.itinerary,
                {
                    dayNumber: newDayIndex + 1,
                    title: '',
                    itineraryId: null,
                    activities: [
                        {
                            placeDetail: '',
                            description: '',
                            address: '',
                            estimatedCost: 0,
                            startTime: '',
                            endTime: '',
                            mapUrl: '',
                            category: '',
                            imageFiles: [],
                            imageUrls: [],
                            imageIds: [],
                            attractionId: null
                        }
                    ]
                }
            ]
        })
        setOpenDays((prev) => ({ ...prev, [newDayIndex]: true }))
        console.log('Added new day:', newDayIndex + 1)
    }

    const removeDay = (dayIndex) => {
        if (tour.itinerary.length === 1) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Phải có ít nhất một ngày trong lịch trình.',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        const newItinerary = tour.itinerary.filter(
            (_, index) => index !== dayIndex
        )
        newItinerary.forEach((day, index) => {
            day.dayNumber = index + 1
        })
        setTour({ ...tour, itinerary: newItinerary })
        setOpenDays((prev) => {
            const newOpenDays = { ...prev }
            delete newOpenDays[dayIndex]
            return newOpenDays
        })
        setActivityPreviews((prev) => {
            const newPreviews = {}
            Object.keys(prev).forEach((key) => {
                const [day] = key.split('-').map(Number)
                if (day !== dayIndex) {
                    const newDay = day > dayIndex ? day - 1 : day
                    newPreviews[`${newDay}-${key.split('-')[1]}`] = prev[key]
                }
            })
            return newPreviews
        })
        setTempUrlInput((prev) => {
            const newTemp = { tour: prev.tour }
            Object.keys(prev).forEach((key) => {
                if (key !== 'tour') {
                    const [day] = key.split('-').map(Number)
                    if (day !== dayIndex) {
                        const newDay = day > dayIndex ? day - 1 : day
                        newTemp[`${newDay}-${key.split('-')[1]}`] = prev[key]
                    }
                }
            })
            return newTemp
        })
        console.log(`Removed day ${dayIndex + 1}`)
    }

    const addActivity = (dayIndex) => {
        const newItinerary = [...tour.itinerary]
        newItinerary[dayIndex].activities.push({
            placeDetail: '',
            description: '',
            address: '',
            estimatedCost: 0,
            startTime: '',
            endTime: '',
            mapUrl: '',
            category: '',
            imageFiles: [],
            imageUrls: [],
            imageIds: [],
            attractionId: null
        })
        setTour({ ...tour, itinerary: newItinerary })
        console.log(`Added new activity to day ${dayIndex + 1}`)
    }

    const removeActivity = (dayIndex, activityIndex) => {
        const newItinerary = [...tour.itinerary]
        if (newItinerary[dayIndex].activities.length === 1) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Mỗi ngày phải có ít nhất một hoạt động.',
                showConfirmButton: false,
                timer: 1800
            })
            return
        }
        newItinerary[dayIndex].activities = newItinerary[
            dayIndex
        ].activities.filter((_, index) => index !== activityIndex)
        setTour({ ...tour, itinerary: newItinerary })
        setActivityPreviews((prev) => {
            const newPreviews = { ...prev }
            delete newPreviews[`${dayIndex}-${activityIndex}`]
            return newPreviews
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
        if (!tour.startTime.trim()) return 'Thời gian bắt đầu là bắt buộc.'
        if (
            !tour.duration ||
            isNaN(parseInt(tour.duration)) ||
            parseInt(tour.duration) <= 0
        )
            return 'Thời gian phải là số lớn hơn 0.'
        if (isNaN(tour.priceAdult) || tour.priceAdult < 0)
            return 'Giá người lớn không được âm.'
        if (isNaN(tour.priceChild5To10) || tour.priceChild5To10 < 0)
            return 'Giá trẻ em 5-10 tuổi không được âm.'
        if (tour.priceChild5To10 > tour.priceAdult)
            return 'Giá trẻ em 5-10 tuổi không được vượt quá giá người lớn.'
        if (isNaN(tour.priceChildUnder5) || tour.priceChildUnder5 < 0)
            return 'Giá trẻ em dưới 5 tuổi không được âm.'
        if (tour.priceChildUnder5 > tour.priceAdult)
            return 'Giá trẻ em dưới 5 tuổi không được vượt quá giá người lớn.'
        if (isNaN(tour.maxGroupSize) || tour.maxGroupSize <= 0)
            return 'Số người tối đa phải lớn hơn 0.'
        if (tour.itinerary.length !== parseInt(tour.duration))
            return `Số ngày trong lịch trình (${tour.itinerary.length}) phải bằng thời gian tour (${tour.duration} ngày).`
        if (tour.imageFiles.length + tour.imageUrls.length === 0)
            return 'Phải cung cấp ít nhất một hình ảnh cho tour.'
        let totalEstimatedCost = 0
        for (let day of tour.itinerary) {
            if (!day.title.trim())
                return `Tiêu đề ngày ${day.dayNumber} là bắt buộc.`
            for (
                let activityIndex = 0;
                activityIndex < day.activities.length;
                activityIndex++
            ) {
                const activity = day.activities[activityIndex]
                if (!activity.description.trim())
                    return `Mô tả hoạt động trong ngày ${day.dayNumber} là bắt buộc.`
                if (!activity.address.trim())
                    return `Địa chỉ hoạt động trong ngày ${day.dayNumber} là bắt buộc.`
                if (!activity.placeDetail.trim())
                    return `Chi tiết địa điểm trong ngày ${day.dayNumber} là bắt buộc.`
                if (isNaN(activity.estimatedCost) || activity.estimatedCost < 0)
                    return `Chi phí dự kiến trong ngày ${day.dayNumber} không được âm.`
                if (
                    (activity.imageFiles?.length || 0) +
                        (activity.imageUrls?.length || 0) ===
                    0
                )
                    return `Phải cung cấp ít nhất một hình ảnh cho hoạt động trong ngày ${day.dayNumber}.`
                totalEstimatedCost += activity.estimatedCost || 0
                if (
                    day.dayNumber === 1 &&
                    activityIndex === 0 &&
                    activity.startTime &&
                    tour.startTime
                ) {
                    const tourStart = new Date(tour.startTime)
                    const activityStart = new Date(
                        `${tour.startTime.split('T')[0]}T${activity.startTime}`
                    )
                    if (activityStart < tourStart) {
                        return `Thời gian bắt đầu của hoạt động đầu tiên trong ngày 1 không được sớm hơn thời gian bắt đầu của tour.`
                    }
                }
            }
        }
        if (totalEstimatedCost > tour.priceAdult) {
            return `Tổng chi phí dự kiến của các hoạt động (${totalEstimatedCost}) không được vượt quá giá tour cho người lớn (${tour.priceAdult}).`
        }
        return ''
    }

    const handleSubmit = async () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        const validationError = validateForm()
        if (validationError) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: validationError,
                showConfirmButton: false,
                timer: 1800
            })
            console.error('Validation error:', validationError)
            setIsSubmitting(false)
            return
        }

        try {
            const formData = new FormData()
            formData.append('TourName', tour.tourName)
            formData.append('Description', tour.description)
            formData.append('Duration', parseInt(tour.duration) || 1)
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
            formData.append('TourTypesId', tour.tourTypesID || 2)
            formData.append('StartTime', tour.startTime)

            tour.imageFiles.forEach((file) => {
                formData.append('ImageFile', file)
            })
            tour.imageUrls.forEach((url) => {
                formData.append('Image', url)
            })

            console.log('Tour FormData:', Array.from(formData.entries()))

            const tourResponse = await partnerTourAPI.createTour(formData)
            console.log('Create tour response:', tourResponse.data)

            const tourId = tourResponse.data.data
            console.log(
                'Tour ID:',
                tourId,
                'ImageIds:',
                tourResponse.data.imageIds || 'None'
            )

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
                console.log(
                    `Creating itinerary for day ${day.dayNumber}:`,
                    itineraryPayload
                )
                const itineraryResponse = await partnerTourAPI.createItinerary(
                    tourId,
                    itineraryPayload
                )
                console.log(
                    `Itinerary response for day ${day.dayNumber}:`,
                    itineraryResponse.data
                )
                newItinerary[dayIndex].itineraryId = itineraryResponse.data.data

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

                    activity.imageFiles.forEach((file) => {
                        activityFormData.append('ImageFile', file)
                    })
                    activity.imageUrls.forEach((url) => {
                        activityFormData.append('Image', url)
                    })

                    console.log(
                        `Activity FormData for day ${day.dayNumber}, activity ${activityIndex + 1}:`,
                        Array.from(activityFormData.entries())
                    )

                    const activityResponse =
                        await partnerTourAPI.createActivity(
                            newItinerary[dayIndex].itineraryId,
                            activityFormData
                        )
                    console.log(
                        `Activity response for day ${day.dayNumber}, activity ${activityIndex + 1}:`,
                        activityResponse.data
                    )
                    newItinerary[dayIndex].activities[
                        activityIndex
                    ].attractionId = activityResponse.data.data
                    newItinerary[dayIndex].activities[activityIndex].imageIds =
                        activityResponse.data.imageIds || []
                }
            }

            setTour({
                ...tour,
                imageIds: tourResponse.data.imageIds || [],
                itinerary: newItinerary
            })

            Swal.fire({
                icon: 'success',
                text: 'Tạo tour thành công!',
                showConfirmButton: false,
                timer: 1800
            })
            navigate('/partner/listTour')
        } catch (err) {
            console.error('API Error (handleSubmit):', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                errors: err.response?.data?.errors || 'Không có chi tiết lỗi'
            })
            let errorMessage = 'Không thể tạo tour. Vui lòng thử lại.'
            if (err.response?.data) {
                if (Array.isArray(err.response.data.errors)) {
                    errorMessage = err.response.data.errors.join(', ')
                } else if (typeof err.response.data.errors === 'string') {
                    errorMessage = err.response.data.errors
                } else if (
                    typeof err.response.data.errors === 'object' &&
                    err.response.data.errors !== null
                ) {
                    errorMessage = Object.values(err.response.data.errors)
                        .flat()
                        .join(', ')
                } else if (err.response.data.message) {
                    errorMessage = err.response.data.message
                }
            } else if (err.message) {
                errorMessage = err.message
            }
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: errorMessage,
                showConfirmButton: false,
                timer: 1800
            })
            if (err.response?.status === 401) {
                localStorage.removeItem('access_token')
                navigate('/signin')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddActivityImageFromFile = (dayIndex, activityIndex) => {
        const key = `${dayIndex}-${activityIndex}`
        if (activityFileInputRefs.current[key]?.current) {
            activityFileInputRefs.current[key].current.click()
        }
    }

    const handleAddTourImageFromFile = () => {
        tourFileInputRef.current.click()
    }

    const toggleDay = (dayIndex) => {
        setOpenDays((prev) => ({ ...prev, [dayIndex]: !prev[dayIndex] }))
        console.log(
            `Toggled day ${dayIndex + 1}:`,
            openDays[dayIndex] ? 'Closed' : 'Opened'
        )
    }

    return (
        <div className="flex-grow max-w-6xl w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-xl mt-8">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                    Tạo Tour
                </h1>
                <button
                    className="px-5 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-lg hover:from-gray-500 hover:to-gray-700 transition-all duration-300 shadow-md flex items-center"
                    onClick={() => navigate(-1)}
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Quay Lại
                </button>
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
                            className="w-full border border-gray-300 p-3 rounded-lg focusBryan
focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="Nhập địa điểm"
                        />
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
                            placeholder="Chọn thời gian bắt đầu"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Danh Mục
                        </label>
                        <input
                            type="text"
                            name="category"
                            value={tour.category}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="Ví dụ: Văn hóa, Phiêu lưu, Nghỉ dưỡng"
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
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Giá Người Lớn (VND)
                        </label>
                        <input
                            type="number"
                            name="priceAdult"
                            value={
                                tour.priceAdult === 0 ||
                                tour.priceAdult === undefined
                                    ? ''
                                    : tour.priceAdult
                            }
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                            step="10000"
                            placeholder="Giá người lớn"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Giá Trẻ Em 5-10 Tuổi (VND)
                        </label>
                        <input
                            type="number"
                            name="priceChild5To10"
                            value={
                                tour.priceChild5To10 === 0 ||
                                tour.priceChild5To10 === undefined
                                    ? ''
                                    : tour.priceChild5To10
                            }
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                            step="10000"
                            placeholder="Giá trẻ em 5-10 tuổi"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Giá Trẻ Em Dưới 5 Tuổi (VND)
                        </label>
                        <input
                            type="number"
                            name="priceChildUnder5"
                            value={
                                tour.priceChildUnder5 === 0 ||
                                tour.priceChildUnder5 === undefined
                                    ? ''
                                    : tour.priceChildUnder5
                            }
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            min="0"
                            step="10000"
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
                            value={
                                tour.maxGroupSize === 0 ||
                                tour.maxGroupSize === undefined
                                    ? ''
                                    : tour.maxGroupSize
                            }
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
                            onChange={handleTourChange}
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
                                    setTempUrlInput((prev) => ({
                                        ...prev,
                                        tour: e.target.value
                                    }))
                                }
                                className="flex-grow border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="https://example.com/image.jpg"
                            />
                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                onClick={handleAddTourUrl}
                            >
                                Thêm
                            </button>
                        </div>
                        {imagePreviews.length > 0 && (
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700 font-medium">
                                        Đã chọn {imagePreviews.length} ảnh
                                    </span>
                                    <button
                                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                        onClick={clearTourImages}
                                    >
                                        Xóa Tất Cả Ảnh
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
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
                            rows="4"
                            placeholder="Mô tả chi tiết về tour"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Trải nghiệm thú vị trong tour
                        </label>
                        <textarea
                            name="tourInfo"
                            value={tour.tourInfo}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            rows="4"
                            placeholder="Thông tin chi tiết về tour"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Tour Trọn Gói bao gồm
                        </label>
                        <textarea
                            name="tourNote"
                            value={tour.tourNote}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            rows="3"
                            placeholder="Thông tin bổ sung hoặc ghi chú"
                        />
                    </div>
                </div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                    Lịch Trình
                </h3>
                {tour.itinerary.map((day, dayIndex) => (
                    <div
                        key={dayIndex}
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
                                        name={`title-${dayIndex}`}
                                        value={day.title}
                                        onChange={(e) => {
                                            console.log(
                                                `Input title for day ${dayIndex + 1}: ${e.target.value}`
                                            )
                                            handleDayChange(
                                                dayIndex,
                                                'title',
                                                e.target.value
                                            )
                                        }}
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        placeholder={`Tiêu đề ngày ${day.dayNumber} (ví dụ: Khám phá Hà Nội)`}
                                    />
                                </div>
                                {day.activities.map(
                                    (activity, activityIndex) => (
                                        <div
                                            key={activityIndex}
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
                                                            activity.estimatedCost ===
                                                                0 ||
                                                            activity.estimatedCost ===
                                                                undefined
                                                                ? ''
                                                                : activity.estimatedCost
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
                                                        step="10000"
                                                        placeholder="Chi phí"
                                                    />
                                                </div>
                                                {/* <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Giờ Bắt Đầu
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
                                                        placeholder="Giờ bắt đầu"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Giờ Kết Thúc
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
                                                        placeholder="Giờ kết thúc"
                                                    />
                                                </div> */}

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
                                                        placeholder="Liên kết bản đồ (ví dụ: https://maps.google.com/...)"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Hình Ảnh Hoạt Động (1
                                                        ảnh cho mỗi hoạt động)
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
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [`${dayIndex}-${activityIndex}`]:
                                                                            e
                                                                                .target
                                                                                .value
                                                                    })
                                                                )
                                                            }
                                                            className="flex-grow border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="https://example.com/image.jpg"
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
                                                    {activityPreviews[
                                                        `${dayIndex}-${activityIndex}`
                                                    ]?.length > 0 && (
                                                        <div className="mt-4">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-gray-700 font-medium">
                                                                    Đã chọn{' '}
                                                                    {
                                                                        activityPreviews[
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
                                                                {activityPreviews[
                                                                    `${dayIndex}-${activityIndex}`
                                                                ].map(
                                                                    (
                                                                        preview,
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
                                                                                    preview
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
                            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-md flex items-center"
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
                            onClick={handleSubmit}
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
                            Tạo Tour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateTour
