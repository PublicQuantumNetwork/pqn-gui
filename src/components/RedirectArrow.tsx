"use client"
import { styled, keyframes } from '@mui/material/styles';
import { Button } from '@mui/material';
import {ReactNode} from 'react';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import { useRouter } from 'next/navigation'; // App Router
import Link from 'next/link';

interface Props{
    children?:ReactNode;
    direction?:string;
}
const PulsateAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const ArrowButton = styled(Button)`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  animation: ${PulsateAnimation} 2s infinite;

  &.left {
    left: 20px;
  }

  &.right {
    right: 20px;
  }

  & svg {
    font-size: 30px;
    color: #333;
  }
`;

export default function RedirectArrow({children, direction}: Props) {
    const {BackArrowLink, ForwardArrowLink} = usePageRedirect();
    
        const handleRedirect = () => {
            if (direction == 'back') {
                return BackArrowLink;
            } else if (direction == 'forward') {
                return ForwardArrowLink;
            } else {
                throw new ReferenceError('Direction not properly set, choose back or foward.');
            }
    };

    return(<Link href={handleRedirect()}><ArrowButton>{children}</ArrowButton></Link>)
    
}