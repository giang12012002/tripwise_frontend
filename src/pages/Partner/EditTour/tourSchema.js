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
                    ) // +1 ngày
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
                                    placeDetail: Yup.string().required(
                                        'Chi tiết địa điểm là bắt buộc.'
                                    ),
                                    description: Yup.string().required(
                                        'Mô tả hoạt động là bắt buộc.'
                                    ),
                                    address: Yup.string().required(
                                        'Địa chỉ hoạt động là bắt buộc.'
                                    ),
                                    estimatedCost: Yup.number()
                                        .required(
                                            'Chi phí dự kiến là bắt buộc.'
                                        )
                                        .min(
                                            0,
                                            'Chi phí dự kiến không được âm.'
                                        ),
                                    startTime: Yup.string(),
                                    endTime: Yup.string(),
                                    category: Yup.string(),
                                    imageFiles: Yup.array(),
                                    imageUrls: Yup.array().of(
                                        Yup.string().matches(
                                            /\.(jpg|jpeg|png|gif)$/i,
                                            'URL ảnh phải hợp lệ (.jpg, .jpeg, .png, .gif).'
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
                })
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
