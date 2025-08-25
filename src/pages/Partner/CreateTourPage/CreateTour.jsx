import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import partnerTourAPI from '@/apis/partnerTourAPI'
import Swal from 'sweetalert2'
import * as Yup from 'yup'
import TimePicker from '@/components/ui/TimePicker'

// Định nghĩa schema xác thực bằng Yup
const tourSchema = Yup.object()
    .shape({
        tourName: Yup.string()
            .required('Tên tour là bắt buộc.')
            .min(1, 'Tên tour không được để trống.'),
        description: Yup.string()
            .required('Mô tả là bắt buộc.')
            .min(1, 'Mô tả không được để trống.'),
        duration: Yup.number()
            .required('Thời gian tour là bắt buộc.')
            .min(1, 'Số ngày phải lớn hơn hoặc bằng 1.'),
        priceAdult: Yup.number()
            .required('Giá người lớn là bắt buộc.')
            .min(0, 'Giá người lớn không được âm.'),
        priceChild5To10: Yup.number()
            .required('Giá trẻ em 5-10 tuổi là bắt buộc.')
            .min(0, 'Giá trẻ em 5-10 tuổi không được âm.')
            .max(
                Yup.ref('priceAdult'),
                'Giá trẻ em 5-10 tuổi không được vượt quá giá người lớn.'
            ),
        priceChildUnder5: Yup.number()
            .required('Giá trẻ em dưới 5 tuổi là bắt buộc.')
            .min(0, 'Giá trẻ em dưới 5 tuổi không được âm.')
            .max(
                Yup.ref('priceAdult'),
                'Giá trẻ em dưới 5 tuổi không được vượt quá giá người lớn.'
            ),
        location: Yup.string()
            .required('Địa điểm là bắt buộc.')
            .min(1, 'Địa điểm không được để trống.'),
        maxGroupSize: Yup.number()
            .required('Số người tối đa là bắt buộc.')
            .min(1, 'Số người tối đa phải lớn hơn 0.'),
        category: Yup.string()
            .required('Danh mục là bắt buộc.')
            .min(1, 'Danh mục không được để trống.'),
        tourNote: Yup.string()
            .required('Ghi chú tour là bắt buộc.')
            .min(1, 'Ghi chú tour không được để trống.'),
        tourInfo: Yup.string()
            .required('Thông tin tour là bắt buộc.')
            .min(1, 'Thông tin tour không được để trống.'),
        startTime: Yup.string()
            .required('Thời gian bắt đầu là bắt buộc.')
            .min(1, 'Thời gian bắt đầu không được để trống.')
            .test(
                'is-future',
                'Thời gian bắt đầu phải lớn hơn ngày hiện tại.',
                (value) => {
                    if (!value) return false
                    const now = new Date()
                    const startTime = new Date(value)
                    return startTime > now
                }
            ),
        imageFiles: Yup.array(),
        imageUrls: Yup.array(),
        itinerary: Yup.array()
            .min(1, 'Phải có ít nhất một ngày trong lịch trình.')
            .test(
                'matches-duration',
                'Số ngày trong lịch trình phải bằng thời gian tour.',
                function (value) {
                    return value.length === parseInt(this.parent.duration)
                }
            )
            .of(
                Yup.object().shape({
                    title: Yup.string()
                        .required('Tiêu đề ngày là bắt buộc.')
                        .min(1, 'Tiêu đề ngày không được để trống.'),
                    activities: Yup.array()
                        .min(1, 'Mỗi ngày phải có ít nhất một hoạt động.')
                        .of(
                            Yup.object()
                                .shape({
                                    placeDetail: Yup.string()
                                        .required(
                                            'Chi tiết địa điểm là bắt buộc.'
                                        )
                                        .min(
                                            1,
                                            'Chi tiết địa điểm không được để trống.'
                                        ),
                                    description: Yup.string()
                                        .required(
                                            'Mô tả hoạt động là bắt buộc.'
                                        )
                                        .min(
                                            1,
                                            'Mô tả hoạt động không được để trống.'
                                        ),
                                    address: Yup.string()
                                        .required(
                                            'Địa chỉ hoạt động là bắt buộc.'
                                        )
                                        .min(
                                            1,
                                            'Địa chỉ hoạt động không được để trống.'
                                        ),
                                    estimatedCost: Yup.number()
                                        .required(
                                            'Chi phí dự kiến là bắt buộc.'
                                        )
                                        .min(
                                            0,
                                            'Chi phí dự kiến không được âm.'
                                        ),
                                    startTime: Yup.string().test(
                                        'start-before-end',
                                        'Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.',
                                        function (value) {
                                            const endTime = this.parent.endTime
                                            if (!value || !endTime) return true
                                            const start = new Date(
                                                `1970-01-01T${value}:00`
                                            )
                                            const end = new Date(
                                                `1970-01-01T${endTime}:00`
                                            )
                                            return start < end
                                        }
                                    ),
                                    endTime: Yup.string(),
                                    // mapUrl: Yup.string().url(
                                    //     'URL bản đồ không hợp lệ.'
                                    // ),
                                    category: Yup.string(),
                                    imageFiles: Yup.array(),
                                    imageUrls: Yup.array()
                                })
                                .test(
                                    'activity-images',
                                    'Phải cung cấp ít nhất một hình ảnh cho hoạt động.',
                                    function (value) {
                                        const { imageFiles, imageUrls } = value
                                        return (
                                            (imageFiles &&
                                                imageFiles.length > 0) ||
                                            (imageUrls && imageUrls.length > 0)
                                        )
                                    }
                                )
                        )
                })
            )
            .test(
                'first-activity-start-time',
                'Thời gian bắt đầu của hoạt động đầu tiên trong ngày 1 phải lớn hơn hoặc bằng thời gian bắt đầu của tour.',
                function (value) {
                    const tourStartTime = this.parent.startTime
                    if (!tourStartTime || !value[0]?.activities[0]?.startTime)
                        return true
                    const tourStart = new Date(tourStartTime)
                    const activityStart = new Date(
                        `${tourStartTime.split('T')[0]}T${value[0].activities[0].startTime}:00`
                    )
                    return activityStart >= tourStart
                }
            )
            .test(
                'total-estimated-cost',
                'Tổng chi phí dự kiến của các hoạt động không được vượt quá giá tour cho người lớn.',
                function (value) {
                    const priceAdult = this.parent.priceAdult
                    const totalEstimatedCost = value.reduce((total, day) => {
                        return (
                            total +
                            day.activities.reduce(
                                (sum, activity) =>
                                    sum + (activity.estimatedCost || 0),
                                0
                            )
                        )
                    }, 0)
                    return totalEstimatedCost <= priceAdult
                }
            )
    })
    .test(
        'tour-images',
        'Phải cung cấp ít nhất một hình ảnh cho tour.',
        function (value) {
            const { imageFiles, imageUrls } = value
            return (
                (imageFiles && imageFiles.length > 0) ||
                (imageUrls && imageUrls.length > 0)
            )
        }
    )

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
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const tourFileInputRef = useRef(null)
    const activityFileInputRefs = useRef({})
    const navigate = useNavigate()
    const { isLoggedIn, isAuthLoading } = useAuth()
    const MAX_IMAGES = 20
    const categories = ['Tham quan', 'Du lịch', 'Ẩm thực', 'Văn hóa']

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

    const handleTourChange = async (e) => {
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
        } else if (name === 'duration') {
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
        // Xóa lỗi khi người dùng chỉnh sửa
        setErrors((prev) => ({ ...prev, [name]: '' }))
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
        setErrors((prev) => ({ ...prev, imageUrls: '' }))
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
        setErrors((prev) => ({
            ...prev,
            [`${dayIndex}-${activityIndex}-${field}`]: ''
        }))
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
        setErrors((prev) => ({ ...prev, [`${key}-imageUrls`]: '' }))
    }

    const handleDayChange = (dayIndex, field, value) => {
        const newItinerary = [...tour.itinerary]
        newItinerary[dayIndex] = {
            ...newItinerary[dayIndex],
            [field]: value
        }
        setTour({ ...tour, itinerary: newItinerary })
        setErrors((prev) => ({ ...prev, [`${dayIndex}-${field}`]: '' }))
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
        setErrors((prev) => ({ ...prev, imageFiles: '', imageUrls: '' }))
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
        setErrors((prev) => ({ ...prev, imageFiles: '', imageUrls: '' }))
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
        setErrors((prev) => ({
            ...prev,
            [`${dayIndex}-${activityIndex}-imageFiles`]: '',
            [`${dayIndex}-${activityIndex}-imageUrls`]: ''
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
        setErrors((prev) => ({
            ...prev,
            [`${dayIndex}-${activityIndex}-imageFiles`]: '',
            [`${dayIndex}-${activityIndex}-imageUrls`]: ''
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
        setErrors((prev) => {
            const newErrors = {}
            Object.keys(prev).forEach((key) => {
                const [day] = key.split('-').map(Number)
                if (day !== dayIndex) {
                    const newDay = day > dayIndex ? day - 1 : day
                    newErrors[
                        `${newDay}-${key.split('-').slice(1).join('-')}`
                    ] = prev[key]
                }
            })
            return newErrors
        })
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
        setErrors((prev) => {
            const newErrors = { ...prev }
            Object.keys(prev).forEach((key) => {
                if (key.startsWith(`${dayIndex}-${activityIndex}`)) {
                    delete newErrors[key]
                }
            })
            return newErrors
        })
    }

    const handleSubmit = async () => {
        if (isSubmitting) return
        setIsSubmitting(true)
        setErrors({})

        try {
            // Xác thực dữ liệu bằng Yup
            await tourSchema.validate(tour, { abortEarly: false })
            setIsLoading(true)

            // Chuẩn bị dữ liệu cho API createTour
            const tourFormData = new FormData()
            tourFormData.append('TourName', tour.tourName)
            tourFormData.append('Description', tour.description)
            tourFormData.append('Duration', parseInt(tour.duration) || 1)
            tourFormData.append('PriceAdult', parseFloat(tour.priceAdult) || 0)
            tourFormData.append(
                'PriceChild5To10',
                parseFloat(tour.priceChild5To10) || 0
            )
            tourFormData.append(
                'PriceChildUnder5',
                parseFloat(tour.priceChildUnder5) || 0
            )
            tourFormData.append('Location', tour.location)
            tourFormData.append(
                'MaxGroupSize',
                parseInt(tour.maxGroupSize) || 1
            )
            tourFormData.append('Category', tour.category)
            tourFormData.append('TourNote', tour.tourNote || '')
            tourFormData.append('TourInfo', tour.tourInfo || '')
            tourFormData.append('TourTypesId', tour.tourTypesID || 2)
            tourFormData.append('StartTime', tour.startTime)
            tour.imageFiles.forEach((file) => {
                tourFormData.append('ImageFile', file)
            })
            tour.imageUrls.forEach((url) => {
                tourFormData.append('Image', url)
            })

            // Gọi API createTour
            const tourResponse = await partnerTourAPI.createTour(tourFormData)
            const tourId = tourResponse.data.data
            const newItinerary = [...tour.itinerary]

            // Gọi API createItinerary và createActivity tuần tự
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
                const itineraryResponse = await partnerTourAPI.createItinerary(
                    tourId,
                    itineraryPayload
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

                    const activityResponse =
                        await partnerTourAPI.createActivity(
                            newItinerary[dayIndex].itineraryId,
                            activityFormData
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
            navigate('/partner')
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const validationErrors = {}
                err.inner.forEach((error) => {
                    // Tạo key lỗi chi tiết cho các trường trong itinerary
                    if (error.path.includes('itinerary')) {
                        const match = error.path.match(
                            /itinerary\[(\d+)\]\.(\w+)/
                        )
                        const activityMatch = error.path.match(
                            /itinerary\[(\d+)\]\.activities\[(\d+)\]\.(\w+)/
                        )
                        if (activityMatch) {
                            const [, dayIndex, activityIndex, field] =
                                activityMatch
                            validationErrors[
                                `${dayIndex}-${activityIndex}-${field}`
                            ] = error.message
                        } else if (match) {
                            const [, dayIndex, field] = match
                            validationErrors[`${dayIndex}-${field}`] =
                                error.message
                        } else {
                            validationErrors[error.path] = error.message
                        }
                    } else {
                        validationErrors[error.path] = error.message
                    }
                })
                setErrors(validationErrors)
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Vui lòng kiểm tra và sửa các lỗi trong biểu mẫu.',
                    showConfirmButton: false,
                    timer: 1800
                })
            } else {
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
            }
        } finally {
            setIsSubmitting(false)
            setIsLoading(false)
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
                            placeholder="Nhập tên tour du lịch"
                        />
                        {errors.tourName && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.tourName}
                            </p>
                        )}
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
                            placeholder="Nhập địa điểm"
                        />
                        {errors.location && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.location}
                            </p>
                        )}
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
                            placeholder="Chọn thời gian bắt đầu"
                        />
                        {errors.startTime && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.startTime}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Danh Mục
                        </label>
                        <select
                            name="category"
                            value={tour.category}
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="" disabled>
                                Chọn một chủ đề
                            </option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.category}
                            </p>
                        )}
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
                            min="1"
                            placeholder="Số ngày"
                        />
                        {errors.duration && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.duration}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Giá Người Lớn (VND)
                        </label>
                        <input
                            type="number"
                            name="priceAdult"
                            value={
                                tour.priceAdult === undefined ||
                                tour.priceAdult === null
                                    ? ''
                                    : tour.priceAdult
                            }
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            step="10000"
                            placeholder="Giá người lớn"
                        />
                        {errors.priceAdult && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.priceAdult}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Giá Trẻ Em 5-10 Tuổi (VND)
                        </label>
                        <input
                            type="number"
                            name="priceChild5To10"
                            value={
                                tour.priceChild5To10 === undefined ||
                                tour.priceChild5To10 === null
                                    ? ''
                                    : tour.priceChild5To10
                            }
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            step="10000"
                            placeholder="Giá trẻ em 5-10 tuổi"
                        />
                        {errors.priceChild5To10 && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.priceChild5To10}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Giá Trẻ Em Dưới 5 Tuổi (VND)
                        </label>
                        <input
                            type="number"
                            name="priceChildUnder5"
                            value={
                                tour.priceChildUnder5 === undefined ||
                                tour.priceChildUnder5 === null
                                    ? ''
                                    : tour.priceChildUnder5
                            }
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            step="10000"
                            placeholder="Giá trẻ em dưới 5 tuổi"
                        />
                        {errors.priceChildUnder5 && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.priceChildUnder5}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-800 font-semibold text-lg mb-2">
                            Số Người Tối Đa
                        </label>
                        <input
                            type="number"
                            name="maxGroupSize"
                            value={
                                tour.maxGroupSize === undefined ||
                                tour.maxGroupSize === null
                                    ? ''
                                    : tour.maxGroupSize
                            }
                            onChange={handleTourChange}
                            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="1"
                            placeholder="Số người tối đa"
                        />
                        {errors.maxGroupSize && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.maxGroupSize}
                            </p>
                        )}
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
                        {(errors.imageFiles || errors.imageUrls) && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.imageFiles || errors.imageUrls}
                            </p>
                        )}
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
                            rows="4"
                            placeholder="Mô tả chi tiết về tour"
                        />
                        {errors.description && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.description}
                            </p>
                        )}
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
                            rows="4"
                            placeholder="Thông tin chi tiết về tour"
                        />
                        {errors.tourInfo && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.tourInfo}
                            </p>
                        )}
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
                            rows="3"
                            placeholder="Thông tin bổ sung hoặc ghi chú"
                        />
                        {errors.tourNote && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.tourNote}
                            </p>
                        )}
                    </div>
                </div>
                <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                    Lịch Trình
                </h3>
                {errors.itinerary && (
                    <p className="text-red-600 text-sm mt-1">
                        {errors.itinerary}
                    </p>
                )}
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
                                        onChange={(e) =>
                                            handleDayChange(
                                                dayIndex,
                                                'title',
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={`Tiêu đề ngày ${day.dayNumber} (ví dụ: Khám phá Hà Nội)`}
                                    />
                                    {errors[`${dayIndex}-title`] && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors[`${dayIndex}-title`]}
                                        </p>
                                    )}
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
                                                        placeholder="Mô tả hoạt động"
                                                    />
                                                    {errors[
                                                        `${dayIndex}-${activityIndex}-description`
                                                    ] && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {
                                                                errors[
                                                                    `${dayIndex}-${activityIndex}-description`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
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
                                                        placeholder="Chi tiết địa điểm"
                                                    />
                                                    {errors[
                                                        `${dayIndex}-${activityIndex}-placeDetail`
                                                    ] && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {
                                                                errors[
                                                                    `${dayIndex}-${activityIndex}-placeDetail`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
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
                                                        placeholder="Địa chỉ hoạt động"
                                                    />
                                                    {errors[
                                                        `${dayIndex}-${activityIndex}-address`
                                                    ] && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {
                                                                errors[
                                                                    `${dayIndex}-${activityIndex}-address`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Chi Phí Dự Kiến (VND)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={
                                                            activity.estimatedCost ===
                                                                undefined ||
                                                            activity.estimatedCost ===
                                                                null
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
                                                        min="0"
                                                        step="10000"
                                                        placeholder="Chi phí"
                                                    />
                                                    {errors[
                                                        `${dayIndex}-${activityIndex}-estimatedCost`
                                                    ] && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {
                                                                errors[
                                                                    `${dayIndex}-${activityIndex}-estimatedCost`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
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
                                                    {errors[
                                                        `${dayIndex}-${activityIndex}-startTime`
                                                    ] && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {
                                                                errors[
                                                                    `${dayIndex}-${activityIndex}-startTime`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
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
                                                    {errors[
                                                        `${dayIndex}-${activityIndex}-endTime`
                                                    ] && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {
                                                                errors[
                                                                    `${dayIndex}-${activityIndex}-endTime`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
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
                                                    {errors[
                                                        `${dayIndex}-${activityIndex}-category`
                                                    ] && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {
                                                                errors[
                                                                    `${dayIndex}-${activityIndex}-category`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
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
                                                    {errors[
                                                        `${dayIndex}-${activityIndex}-mapUrl`
                                                    ] && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {
                                                                errors[
                                                                    `${dayIndex}-${activityIndex}-mapUrl`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">
                                                        Hình Ảnh Hoạt Động
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
                                                    {(errors[
                                                        `${dayIndex}-${activityIndex}-imageFiles`
                                                    ] ||
                                                        errors[
                                                            `${dayIndex}-${activityIndex}-imageUrls`
                                                        ]) && (
                                                        <p className="text-red-600 text-sm mt-1">
                                                            {errors[
                                                                `${dayIndex}-${activityIndex}-imageFiles`
                                                            ] ||
                                                                errors[
                                                                    `${dayIndex}-${activityIndex}-imageUrls`
                                                                ]}
                                                        </p>
                                                    )}
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
