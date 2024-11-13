import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../contexts/ProductContext';
import PhotoProduct from '../components/PhotoProduct';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import Input from '../components/ui/Input';
import { FieldValues, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { toastifyConfig } from '@/utilities/toastify.utility';
import HeadPage from '@/components/HeadPage';

export const ProductPage = () => {
  const { register, handleSubmit } = useForm();
  const { getProduct, product, deleteProduct, updateStock } = useProduct();
  const { user, getDataUser, userData, isAuthenticated } = useAuth();
  const { id } = useParams<{ id: string }>();
  const productID = id?.split(':')[1];
  const [productOwner, setProductOwner] = useState<boolean>(false);
  const navigate = useNavigate();

  const Edit = () => {
    navigate(`/update-product/:${productID}`);
  };
  const back = () => {
    navigate('/', { replace: true });
  };

  const ProductDelete = async () => {
    deleteProduct(productID as unknown as number);
    back();
  };

  const onSubmit = async (data: FieldValues) => {
    const res = await updateStock(parseInt(data.stock), productID as unknown as string);
    if (res === 200) {
      toast.success('Stock Updated', toastifyConfig);
    }
  };

  const markAsSold = async () => {
    const res = await updateStock(0, productID as unknown as string);
    if (res === 200) {
      toast.success('Marked as sold', toastifyConfig);
    }
  };

  useEffect(() => {
    if (product) {
      getDataUser(product.userId);
    }
  }, [product]);

  useEffect(() => {
    if (productID) {
      getProduct(Number(productID));
    }
  }, [productID]);

  useEffect(() => {
    if (!user) return;
    setProductOwner(user.id === product.userId);
  }, [user, product]);

  const userProfile = () => {
    navigate(`/user-Profile/id:${product.userId}`);
  };

  if (!product) {
    return (
      <div className="flex flex-row items-center justify-center min-h-screen bg-gray-100 p-4">
        This Product Does Not Exist
        <button className="ml-4 border border-gray-500 px-3 py-1 rounded" onClick={back}>
          back
        </button>
      </div>
    );
  }
  if (!product.photos) {
    return <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">Loading...</div>;
  }
  return (
    <>
      <HeadPage namePage={'Product Page'} />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="shadow-lg rounded-lg max-w-5xl w-full overflow-hidden px-6 pb-4">
          <div className="h-96 w-full mt-10 flex items-center justify-center">
            <PhotoProduct images={product.photos as unknown as string[]} />
          </div>
          <div className="my-6 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white mr-4 no-drag">{product.name}</h1>
              <span className="text-3xl text-green-600 font-semibold no-drag">${product.price}</span>
            </div>
            <div>
              {productOwner || user?.role === 'admin' ? (
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <Dialog>
                    <DialogTrigger className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                      Delete
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete this product and remove the data
                          from our servers.
                          <Button fieldname="Delete" onClick={ProductDelete} />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <button
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    onClick={Edit}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <img src={userData?.photo} onClick={userProfile} className="w-10 h-10 rounded-full mr-2" />
                  <div className="flex flex-row">
                    <p className="text-gray-500 pr-2 cursor-pointer">Seller:</p>
                    <div className="cursor-pointer" onClick={userProfile}>
                      {userData?.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            {user?.role === 'admin' && !productOwner && (
              <div className="flex items-center">
                <img src={userData?.photo} onClick={userProfile} className="w-10 h-10 rounded-full mr-2" />
                <div className="flex flex-row">
                  <p className="text-gray-500 pr-2 cursor-pointer">Seller:</p>
                  <div className="cursor-pointer" onClick={userProfile}>
                    {userData?.name}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mb-8">
            <h2 className="text-xl text-white pb-2 mb-2 font-semibold no-drag no-select">Description</h2>
            <p className="text-gray-300">{product.description}</p>
          </div>
          <div className="mb-4">
            <div>
              <p className="text-gray-300">
                <strong className="mr-2 text-white no-drag no-select">Stock:</strong> {product.stock}
                {productOwner && (
                  <Dialog>
                    <DialogTrigger>
                      <img src="/edit.svg" className="w-6 h-6 ml-2" alt="Edit Stock" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Change Stock</DialogTitle>
                      <DialogDescription>
                        If you send 0, you will mark the product as sold, or out of stock,
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <Input min={0} type="number" fieldname="Stock" {...register('stock', { required: true })} />
                          <Button type="submit" fieldname="Change" />
                        </form>
                      </DialogDescription>
                    </DialogContent>
                  </Dialog>
                )}
              </p>
            </div>
            <p className="text-gray-300">
              <strong className="mr-2 text-white no-drag no-select">Location:</strong> {product.location}
            </p>
            <p className="text-gray-300">
              <strong className="mr-2 text-white no-drag no-select">Category:</strong>
              {product.category}
            </p>
          </div>
          {isAuthenticated ? (
            <div>
              {productOwner ? (
                <div>
                  <Button
                    styles="bg-red-500 px-4 py-2 rounded-md text-white"
                    fieldname="Mark as sold"
                    onClick={markAsSold}
                  />
                </div>
              ) : (
                <a
                  href={`https://wa.me/${userData?.phoneNumber}?text=I'm interested in ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto bg-green-500 text-white py-2 my-4 px-4 rounded-lg hover:bg-green-600 transition-colors no-select no-drag"
                >
                  Contact me
                </a>
              )}
            </div>
          ) : (
            <div>You need to be logged in to contact me</div>
          )}
        </div>
      </div>
    </>
  );
};
