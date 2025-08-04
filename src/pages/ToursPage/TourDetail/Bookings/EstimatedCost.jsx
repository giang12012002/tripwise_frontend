import React from 'react'

function EstimatedCost({
    adultNum,
    childUnder9Num,
    childUnder3Num,
    adultCost,
    childUnder9Cost,
    childUnder3Cost,
    estimatedCost
}) {
    return (
        <div>
            <p className="text-gray-700 font-medium">Chi tiết giá:</p>
            <ul className="text-gray-700 ml-4 list-disc">
                <li>
                    Người lớn ({adultNum} người):{' '}
                    <span className="text-blue-600 font-semibold">
                        {adultCost.toLocaleString()} đ
                    </span>
                </li>
                <li>
                    Trẻ em dưới 9 tuổi ({childUnder9Num} người):{' '}
                    <span className="text-blue-600 font-semibold">
                        {childUnder9Cost.toLocaleString()} đ
                    </span>
                </li>
                <li>
                    Trẻ em dưới 3 tuổi ({childUnder3Num} người):{' '}
                    <span className="text-blue-600 font-semibold">
                        {childUnder3Cost.toLocaleString()} đ
                    </span>
                </li>
            </ul>

            <p className="text-gray-700 font-medium mt-1">
                Tổng cộng:{' '}
                <span className="text-red-600 text-lg font-bold underline">
                    {estimatedCost.toLocaleString()} đ
                </span>
            </p>
        </div>
    )
}

export default EstimatedCost
