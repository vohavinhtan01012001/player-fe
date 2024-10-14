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
        toast.success(res.data.msg)
        localStorage.setItem('accessToken', res.data.accessToken)
        if (res.data.data.role === 1) {
          navigate('/admin/users')
          window.location.reload()
        }
        else{
          navigate('/')
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
