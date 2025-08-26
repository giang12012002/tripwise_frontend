// src/validations/tourSchema.js
import * as Yup from 'yup'

export const tourSchema = Yup.object()
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
                'is-future-by-one-day',
                'Thời gian bắt đầu phải lớn hơn ngày hiện tại ít nhất 1 ngày.',
                (value) => {
                    if (!value) return false
                    const now = new Date()
                    const minStartTime = new Date(
                        now.getTime() + 24 * 60 * 60 * 1000
                    ) // Current time + 1 day
                    const startTime = new Date(value)
                    return startTime >= minStartTime
                }
            ),
        imageFiles: Yup.array(),
        imageUrls: Yup.array().of(
            Yup.string().matches(
                /\.(jpg|jpeg|png|gif)$/i,
                'URL ảnh phải có định dạng .jpg, .jpeg, .png hoặc .gif.'
            )
        ),
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
                                                `1970-01-01T${value}`
                                            )
                                            const end = new Date(
                                                `1970-01-01T${endTime}`
                                            )

                                            console.log(
                                                `start: ${start}, end: ${end}`
                                            )
                                            return start < end
                                        }
                                    ),
                                    endTime: Yup.string(),
                                    category: Yup.string(),
                                    imageFiles: Yup.array(),
                                    imageUrls: Yup.array().of(
                                        Yup.string().matches(
                                            /\.(jpg|jpeg|png|gif)$/i,
                                            'URL ảnh phải có định dạng .jpg, .jpeg, .png hoặc .gif.'
                                        )
                                    )
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
                        .test(
                            'ascending-activity-times',
                            'Thời gian bắt đầu của hoạt động phải lớn hơn hoặc bằng thời gian kết thúc của hoạt động trước đó.',
                            function (activities) {
                                if (!activities || activities.length <= 1)
                                    return true

                                for (let i = 1; i < activities.length; i++) {
                                    const prev = activities[i - 1]
                                    const curr = activities[i]

                                    if (!curr.startTime || !prev.endTime)
                                        continue

                                    const currentStart = new Date(
                                        `1970-01-01T${curr.startTime}`
                                    )
                                    const prevEnd = new Date(
                                        `1970-01-01T${prev.endTime}`
                                    )

                                    if (currentStart < prevEnd) {
                                        return this.createError({
                                            path: `${this.path}[${i}].startTime`, // gắn lỗi vào activity cụ thể
                                            message:
                                                'Thời gian bắt đầu của hoạt động phải lớn hơn hoặc bằng thời gian kết thúc của hoạt động trước đó.'
                                        })
                                    }
                                }
                                return true
                            }
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
                        `${tourStartTime.split('T')[0]}T${value[0].activities[0].startTime}`
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
