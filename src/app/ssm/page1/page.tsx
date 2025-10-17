"use client"

import {useState, useEffect, SetStateAction} from 'react';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import { useRouter } from 'next/navigation';
import SSMTextbox from '@/components/SSMTextbox';
import ModalBox from '@/components/ModalBox';
import { Router } from 'next/router';
import { useEnterKey } from '@/hooks/useEnterKey';
import { ssmPost } from '@/calls';

async function ssmSubmit(currentAngle: number,
    setAngleChoices: React.Dispatch<SetStateAction<number []>>,
    arrowRotation: number, angleChoices: number[], setCurrentAngle: React.Dispatch<SetStateAction<number>>, router: Router) {
      if (currentAngle == 1) {
        setAngleChoices([arrowRotation])
      } else if (currentAngle == 2) {
        setAngleChoices([...angleChoices, arrowRotation])
        const response = await ssmPost([...angleChoices, arrowRotation])

        if (response.status == 200) {
          const data = await response.json();
          const value = data.chsh_value;
          const error = data.chsh_error;
          router.push(`/ssm/page3?fail=false&value=${value}&error=${error}`);
        } else {
          router.push(`/ssm/page3?fail=true`);
        }

      } else {
        console.error("Something went wrong please refresh the page")
      }

      setCurrentAngle(currentAngle+1)
  }

export default function hiya(){
const {setBackArrowLink, setForwardArrowLink} = usePageRedirect();
    const router = useRouter();
    const [triggerSubmit, setTriggerSubmit] = useState(0);

    const setLinks=()=>{
        setBackArrowLink("/ssm/page1/");
        setForwardArrowLink("/ssm/page2/");
    }

    useEffect(() => {
        const interval = setInterval(() => {
        fetchData();
        }, 100);

        return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
        if (triggerSubmit != 0) {
        //console.log("in useEffect")
        ssmSubmit(currentAngle, setAngleChoices, arrowRotation, angleChoices, setCurrentAngle, router)
        if (currentAngle == 2) {
            setOpenModal(true)
        }
    }
    }, [triggerSubmit])

    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/serial/');
        const data = await response.json();
        setData(data.theta);
        console.log(data.theta);
        setArrowRotation(data.theta || 0);
      } catch (error) {
        setArrowRotation(0);
        console.error('Error fetching data:', error);
      }
    };

} 