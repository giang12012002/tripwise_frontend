import React from 'react'

function EstimatedCost({
    adultNum,
    childUnder10Num,
    childUnder5Num,
    adultCost,
    childUnder10Cost,
    childUnder5Cost,
    price1Adult,
    price1ChildUnder10,
    price1ChildUnder5,
    estimatedCost
}) {
    return (
        <div>
            <p className="text-gray-700 font-medium">Chi tiết giá:</p>
            <ul className="text-gray-700 ml-4 list-disc">
                <li>
                    Người lớn ({price1Adult.toLocaleString()} đ * {adultNum}{' '}
                    người):{' '}
                    <span className="text-blue-600 font-semibold">
                        {adultCost.toLocaleString()} đ
                    </span>
                </li>
                <li>
                    Trẻ em dưới 10 tuổi ( {price1ChildUnder10.toLocaleString()}{' '}
                    đ * {childUnder10Num} người):{' '}
                    <span className="text-blue-600 font-semibold">
                        {childUnder10Cost.toLocaleString()} đ
                    </span>
                </li>
                <li>
                    Trẻ em dưới 5 tuổi ( {price1ChildUnder5.toLocaleString()} đ
                    * {childUnder5Num} người):{' '}
                    <span className="text-blue-600 font-semibold">
                        {childUnder5Cost.toLocaleString()} đ
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
