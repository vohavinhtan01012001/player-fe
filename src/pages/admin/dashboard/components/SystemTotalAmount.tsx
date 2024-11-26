import React, { useEffect, useState } from 'react'
import { SystemService } from '../../../../services/systemService';

export default function SystemTotalAmount() {
  const [system, setSystem] = useState<any>();
  const fetchSystem = async () => {
    try {
      const res = await SystemService.getSystem();
      setSystem(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSystem()
  }, [])


  return (
      <div className='flex items-center gap-3 pt-[30px]'>
        <div className='flex flex-col justify-center mx-auto bg-red-600 *:text-white items-center gap-3 shadow-lg px-6 w-full h-[120px] rounded-lg'>
          <div className='flex flex-col items-center'>
            <p className='text-xl font-bold'>Total Amount</p>
            <p>(excluding transaction fees)</p>
          </div>
          <p className='text-center'>
            {system?.totalAmount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(system.totalAmount) : '0.00 USD'}
          </p>
        </div>
        <div className='flex flex-col justify-center mx-auto bg-yellow-600 *:text-white items-center gap-3 shadow-lg px-6 w-full h-[120px] rounded-lg'>
          <div className='flex flex-col items-center'>
            <p className='text-xl font-bold'>Total Amount</p>
            <p>(minus transaction fee)</p>
          </div>
          <p className='text-center'>
            {system?.totalAmount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(system.totalAmount - system.transactionFee) : '0.00 USD'}
          </p>
        </div>
        <div className='flex flex-col justify-center mx-auto bg-blue-600 *:text-white items-center gap-3 shadow-lg px-6 w-full h-[120px] rounded-lg'>
          <p className='text-xl font-bold'>Transaction Fee</p>
          <p>
            {system?.transactionFee ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(system.transactionFee) : '0.00 USD'}
          </p>
        </div>
    </div>
  )
}
