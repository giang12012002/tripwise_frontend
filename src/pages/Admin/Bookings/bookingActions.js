// bookingActions.js
import Swal from 'sweetalert2'
import { adminManagerTourAPI } from '@/apis'
import { useNavigate } from 'react-router-dom'

export const useBookingActions = (fetchBookingList) => {
    const navigate = useNavigate()

    // Xem chi tiết
    const handleViewDetails = (bookingId, tourId) => {
        navigate(`/admin/bookings/${bookingId}`, { state: { tourId } })
    }

    // Xác nhận hoàn tiền
    const handleConfirmRefund = async (bookingId) => {
        const result = await Swal.fire({
            title: 'Xác nhận hoàn tiền?',
            text: `Bạn có chắc muốn xác nhận hoàn tiền cho booking #${bookingId}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        })
        if (result.isConfirmed) {
            try {
                await adminManagerTourAPI.confirmRefund(bookingId)
                Swal.fire(
                    'Thành công',
                    'Hoàn tiền đã được xác nhận!',
                    'success'
                )
                fetchBookingList()
            } catch (err) {
                Swal.fire('Lỗi', 'Không thể xác nhận hoàn tiền', 'error')
            }
        }
    }

    // Từ chối hoàn tiền
    const handleRejectRefund = async (bookingId) => {
        const { value: reason } = await Swal.fire({
            title: 'Từ chối hoàn tiền',
            input: 'text',
            inputLabel: 'Lý do từ chối',
            inputPlaceholder: 'Nhập lý do...',
            showCancelButton: true,
            confirmButtonText: 'Gửi',
            cancelButtonText: 'Hủy',
            inputValidator: (value) => {
                if (!value) return 'Bạn phải nhập lý do!'
            }
        })

        if (reason) {
            try {
                await adminManagerTourAPI.rejectRefund({
                    bookingId,
                    rejectReason: reason
                })
                Swal.fire(
                    'Thành công',
                    'Đã từ chối yêu cầu hoàn tiền',
                    'success'
                )
                fetchBookingList()
            } catch (err) {
                Swal.fire('Lỗi', 'Không thể từ chối hoàn tiền', 'error')
            }
        }
    }

    // Hoàn tất hoàn tiền
    const handleCompleteRefund = async (bookingId) => {
        const result = await Swal.fire({
            title: 'Hoàn tất hoàn tiền?',
            text: `Bạn có chắc muốn hoàn tất hoàn tiền cho booking #${bookingId}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Hoàn tất',
            cancelButtonText: 'Hủy'
        })
        if (result.isConfirmed) {
            try {
                await adminManagerTourAPI.completeRefund(bookingId)
                Swal.fire(
                    'Thành công',
                    'Hoàn tiền đã được hoàn tất!',
                    'success'
                )
                fetchBookingList()
            } catch (err) {
                Swal.fire('Lỗi', 'Không thể hoàn tất hoàn tiền', 'error')
            }
        }
    }

    return {
        handleViewDetails,
        handleConfirmRefund,
        handleRejectRefund,
        handleCompleteRefund
    }
}
