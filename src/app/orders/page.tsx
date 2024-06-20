import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { db } from '@/db';
import { formatPrice } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowDown } from 'lucide-react';
import { notFound } from 'next/navigation';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.email) {
    return notFound();
  }

  const orders = await db.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      configuration: true,
      billingAddress: true,
      shippingAddress: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className='bg-white'>
      <MaxWidthWrapper className='py-8 grow h-full'>
        <h1 className='flex items-center space-x-1'>
          <span className='text-lg text-zinc-700 font-bold'>
            Here are your orders
          </span>
          <ArrowDown className='size-5 text-zinc-700' />
        </h1>
        <div className='mt-4'>
          {orders.map((order) => (
            <div key={order.id} className='flex flex-col mt-8 px-4 divide-y'>
              <div className='text-xs pb-1.5'>
                <p className='text-zinc-500 font-medium '>Ordered on</p>
                <p className='text-zinc-500 font-medium'>
                  {order.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div className='py-4 flex flex-col gap-y-6 lg:flex-row items-start justify-between h-full w-full '>
                <div className='flex flex-col gap-y-6 lg:flex-row items-start gap-x-6'>
                  <img
                    src={order.configuration.imageUrl!}
                    alt='image-url'
                    className='w-24'
                  />
                  <div className='grid grid-cols-2 gap-7'>
                    <div className='text-base font-medium'>
                      <p className='text-zinc-900 '>Color</p>
                      <p className='text-zinc-500 first-letter:capitalize'>
                        {order.configuration.color}
                      </p>
                    </div>
                    <div className='text-base font-medium'>
                      <p className='text-zinc-900 '>Model</p>
                      <p className='text-zinc-500 first-letter:capitalize'>
                        {order.configuration.model}
                      </p>
                    </div>
                    <div className='text-base font-medium'>
                      <p className='text-zinc-900 '>Finish</p>
                      <p className='text-zinc-500 first-letter:capitalize'>
                        {order.configuration.finish}
                      </p>
                    </div>
                    <div className='text-base font-medium'>
                      <p className='text-zinc-900 '>Material</p>
                      <p className='text-zinc-500 first-letter:capitalize'>
                        {order.configuration.material}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col gap-y-6 lg:flex-row items-start gap-x-16'>
                  <div>
                    <div className='text-base font-medium'>
                      <p className='text-zinc-900 text-sm'>Order number</p>
                      <p className='mt-0.5  text-zinc-500'>{order.id}</p>
                    </div>
                    <div className='text-base font-medium mt-4'>
                      <p className='text-zinc-900 text-sm'>Total</p>
                      <p className='mt-0.5 text-zinc-500'>
                        {formatPrice(order.amount)}
                      </p>
                    </div>
                    <div className='text-base font-medium mt-4'>
                      <p className='text-zinc-900 text-sm'>Order Status</p>
                      <p className='mt-0.5 text-zinc-500'>{order.status}</p>
                    </div>
                  </div>

                  <div className='text-base'>
                    <p className='font-medium text-sm text-gray-900'>
                      Shipping address
                    </p>
                    <div className='mt-1 text-zinc-700'>
                      <address className='not-italic font-medium text-zinc-500'>
                        <span className='block'>
                          {order.shippingAddress?.name}
                        </span>
                        <span className='block'>
                          {order.shippingAddress?.street}
                        </span>
                        <span className='block'>
                          {order.shippingAddress?.postalCode}
                        </span>
                        <span className='block'>
                          {order.shippingAddress?.city}
                        </span>
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
export default Page;
