import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Input from "../../../../components/Input";
import Label from "../../../../components/Label";
import { toast } from 'react-toastify';
import { AuthService } from '../../../../services/AuthService';
import { useNavigate } from 'react-router-dom';

export type LoginForm = {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      const res = await AuthService.login(data)
      if (res.data.accessToken) {
        if (res.data.data.status != 0) {
          toast.success(res.data.msg)
          localStorage.setItem('accessToken', res.data.accessToken)
          if (res.data.data.role === 1) {
            navigate('/admin/users')
          }
          else {
            navigate('/')
          }
          window.location.reload()
        }
        else {
          toast.error("Account has been locked")
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* <div className='flex items-center -mt-8 mb-11 cursor-pointer shadow overflow-hidden rounded-lg'>
        <div onClick={() => setCheckPlayer(false)} className={`duration-300 w-[100px] ${checkPlayer ? "bg-[#9e8f8c33]" : "bg-[#ff4b2b] text-white"} py-2 `}>
          User
        </div>
        <div onClick={() => setCheckPlayer(true)} className={`duration-300  w-[100px] ${checkPlayer ? "bg-[#ff4b2b] text-white" : "bg-[#bebab933] text-[#333]"}   font-semibold py-2 `}>
          Player
        </div>
      </div> */}
      <Label className='text-base' required>Email</Label>
      <Input
        type='email'
        {...register('email')}
        errorMessage={errors.email?.message}
      />
      <Label className='text-base' required>Password</Label>
      <Input
        type='password'
        {...register('password')}
        errorMessage={errors.password?.message}
      />

      <button type='submit'>Sign In</button>
    </form>
  );
}

export default Login;
