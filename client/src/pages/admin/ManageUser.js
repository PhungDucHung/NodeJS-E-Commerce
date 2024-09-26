import React, { useCallback, useEffect, useState } from 'react';
import { apiGetUsers, apiUpdateUser, apiDeleteUser } from '../../apis/user';
import { roles } from '../../ultils/contants';
import moment from 'moment';
import { InputField, Pagination, Select, InputForm ,Button} from '../../components';
import useDebounce from '../../hook/useDebounce';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'


const ManageUser = () => {
  const { handleSubmit, register, formState: {errors}} = useForm({
    email: '',
    firstname: '',
    lastname: '',
    role: '',
    phone: '',
    status: '',
  })

  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState(0); // Tạo state cho counts
  const [queries, setQueries] = useState({ q: "" });
  const [editElm, setEditElm] = useState(null); 
  const [params] = useSearchParams();
  const [update, setUpdate] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]); 


  const fetchUsers = async (params) => { 
    const response = await apiGetUsers({...params, limit: process.env.REACT_APP_LIMIT});
    if (response.success) {
      setUsers(response.users);
      setCounts(response.counts); // Cập nhật counts
    }
  };

  const render = useCallback(() => {
    setUpdate(!update)
  },[update])

  const queriesDebounce = useDebounce(queries.q, 800);

  useEffect(() => {
    const queries = Object.fromEntries([...params]) ;
    if (queriesDebounce) queries.q = queriesDebounce;
    fetchUsers(queries);
  }, [queriesDebounce ,params,update ]);

const handleUpdate = async(data) => {
  const response = await apiUpdateUser(data, editElm._id );
  if (response.success){  
     setEditElm(null)
     render();
     toast.success(response.mes)
  } else toast.error(response.mes)
}
const handleDeleteUser = async (uid) => {
  const result = await Swal.fire({
    title: 'Are you sure you want to delete?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
  });

  if (result.isConfirmed) {
    try {
      const response = await apiDeleteUser(uid);
      if (response.success) {
        render(); // Cập nhật lại giao diện
        toast.success(response.mes);
      } else {
        toast.error(response.mes);
      }
    } catch (error) {
      toast.error('An error occurred while deleting the user.');
      console.error(error);
    }
  }
};


  return (
    <div className='w-full pl-8'>
      <h1 className='h-[75px] flex justify-between items-center text-3xl font-bold px-4 borde-b'>
        <span>Manage Users</span>
      </h1>
      <div className='w-full p-4'>
        <div className='flex pb-4'>
          <InputField
            nameKey={'q'}
            value={queries.q}
            setValue={setQueries}
            setInvalidFields={setInvalidFields} 
            style='w500'
            placeholder='Search name or mail user ...'
            isHideLabel
          />
        </div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          {editElm && <Button type='submit'>Update</Button>}
          <table className='table-auto mb-6 text-left w-[1150px]'>
            <thead className='font-bold bg-gray-700 text-[13px] text-white'>
              <tr className='border border-gray-500'>
                <th className='px-4 py-2'>#</th>
                <th className='px-4 py-2'>Email address</th>
                <th className='px-4 py-2'>Firstname</th>
                <th className='px-4 py-2'>Lastname</th>
                <th className='px-4 py-2'>Role</th>
                <th className='px-4 py-2'>Phone</th>
                <th className='px-4 py-2'>Status</th>
                <th className='px-4 py-2'>Created At</th>
                <th className='px-4 py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((el, idx) => (
                <tr key={el._id} className='border border-gray-500'>
                  <td className='py-2 px-4'>{idx + 1}</td>
                  <td className='py-2 px-4'>
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editElm?.email}
                        id={'email'}
                        validate={{
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        }}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editElm?.firstname}
                        id={'firstname'}
                        validate={{ required: "Firstname is required" }}
                      />
                    ) : (
                      <span>{el.firstname}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editElm?.lastname}
                        id={'lastname'}
                        validate={{ required: "Lastname is required" }}
                      />
                    ) : (
                      <span>{el.lastname}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>
                    {editElm?._id === el._id ? <Select /> : <span>{roles.find(role => +role.code === +el.role)?.value}</span>}
                  </td>
                  <td className='py-2 px-4'>
                    {editElm?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        defaultValue={editElm?.mobile}
                        id={'mobile'}
                        validate={{ 
                          required: "Mobile is required", 
                          pattern: {
                            value: /^[62|0]+\d{9}/gi,
                            message: "Invalid phone number"
                          }
                        }}
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  <td className='py-2 px-4'>
                    {editElm?._id === el._id ? <Select /> : <span>{el.isBlocked ? 'Blocked' : 'Active'}</span>}
                  </td>
                  <td className='py-2 px-4'>{moment(el.createdAt).format('DD/MM/YYYY')}</td>
                  <td className='py-2 px-4'>
                    { editElm?._id === el._id ? <span onClick={() => setEditElm(null)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Back</span> :   <span onClick={() => setEditElm(el)} className='px-2 text-orange-600 hover:underline cursor-pointer'>Edit</span>}
                    <span onClick={() => handleDeleteUser(el._id) } className='px-2 text-orange-600 hover:underline cursor-pointer'>Delete</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>

        <div className='w-full flex justify-end '>
          <Pagination totalCount={counts} /> 
        </div>
      </div>
    </div>
  );
}

export default ManageUser;
