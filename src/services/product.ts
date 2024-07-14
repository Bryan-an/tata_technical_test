import {axiosInstance} from '@config/axios';
import {type ProductModel} from '@types/product';

const getAll = async () =>
  await axiosInstance.get<ProductModel.Response.GetAll>('');

const getOne = async (id: string) =>
  await axiosInstance.get<ProductModel.Response.GetOne>(`/${id}`);

const create = async (data: ProductModel.Request.Create) =>
  await axiosInstance.post<ProductModel.Response.Create>('', data);

const update = async (id: string, data: ProductModel.Request.Update) =>
  await axiosInstance.put<ProductModel.Response.Update>(`/${id}`, data);

const remove = async (id: string) =>
  await axiosInstance.delete<ProductModel.Response.Delete>(`/${id}`);

const verifyId = async (id: string) =>
  await axiosInstance.get<boolean>(`/verification/${id}`);

export const productService = {
  getAll,
  getOne,
  create,
  update,
  remove,
  verifyId,
};
