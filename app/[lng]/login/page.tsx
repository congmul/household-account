"use client"

import { useTranslation } from '@/app/lib/i18n/client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { MSLoginButton, GoogleLoginButton, GuestLoginButton } from '@/app/ui/shared-components';
import { Button, Input } from 'react-component-tailwindcss';
import img from '/public/assets/icons/icon-72x72.png';
import Image from 'next/image';
import { userService, healthService } from '@/app/lib/api-services';
import { useCookies } from 'react-cookie'

export default function Index({ params: { lng }} : any) {
    const { t } = useTranslation(lng, 'main');
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [_, setCookie] = useCookies(["userInfo"])
    const [ isLoggingin, setIsLoggingin ] = useState(false);

    // Wake-up account-sevice & core-service
    useEffect(() => {
      healthService.accountHealth()
      healthService.coreHealth()
    }, [])

    const handleSubmit = async (e:any) => {
      try{
        e.preventDefault();
        setIsLoggingin(true);
        const response = await userService.login({email, password});
        setCookie("userInfo", response, { path: '/', maxAge: 3600 }); // maxAge - seconds
        sessionStorage.setItem('userInfo', JSON.stringify(response.userInfo));
        setTimeout(() => {
          router.push(`/${lng}/calendar`);
        }, 300)
      }catch(err){
        console.log(err);
      }finally{
        setTimeout(() => {
          setIsLoggingin(false);
        }, 1000)
      }
    };

    function onChange(value:string, type: string) {
      if(type === 'email'){
        setEmail(value);
      }else{
        setPassword(value);
      }
    }
    return (<>
       
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-[25rem] p-8 space-y-4 bg-white rounded-md shadow-md">
        <div className="flex flex-col items-center justify-center">
          <Image alt="logo" src={img} width={"72"} />
        </div>
        <Input type={"email"} placeholder={t("general.email")} onChange={onChange} inputSize='lg' color='pink' />
        <Input type={"password"} placeholder={t("general.password")} onChange={onChange} inputSize='lg' color='pink' />
        <Button
          onClick={handleSubmit}
          loading={isLoggingin} color='pink'
          className="w-full"
        >
          {t('auth.login')}
        </Button>
        <div className="flex items-center justify-between mt-4">
          <hr className="w-full border-gray-300" />
          <span className="px-2 text-sm text-gray-500">Or</span>
          <hr className="w-full border-gray-300" />
        </div>
        <div className="space-y-4">
            <MSLoginButton /> 
            <GoogleLoginButton />
            <GuestLoginButton lng={lng} />
        </div>
      </div>
    </div>
    </>
    );
}