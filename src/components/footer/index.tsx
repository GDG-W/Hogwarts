'use client';
import FooterAnimation from '@/animations/components/Footer';
import Button from '@/components/button';
import Image from 'next/image';
import styles from './footer.module.scss';
import { useEffect, useState, useRef } from 'react';
import { Modal } from '../modal';
import PurchaseTicket from '../purchase-ticket';

const currentYear = new Date().getFullYear();

const socialMedia = [
  { link: '#', title: 'twitter' },
  {
    link: '#',
    title: 'facebook',
  },
  { link: '#', title: 'instagram' },
  { link: '#', title: 'linkedin' },
  { link: '#', title: 'youtube' },
];

const footerLinks = [
  {
    link: '#',
    title: 'Claim Ticket',
  },
  {
    link: '#',
    title: 'Upgrade Ticket',
  },
  {
    link: '#',
    title: 'Ticket FAQ',
  },
  {
    link: 'https://gdg.community.dev/gdg-lagos/',

    title: 'Join the community',
  },
  {
    link: ' https://policies.google.com/privacy',
    title: 'Community Guidelines',
  },
  {
    link: 'https://policies.google.com/privacy',
    title: 'Privacy Policy',
  },
  {
    link: '',
    title: 'Contact Us',
  },
];

export const Footer = () => {
  const [openTicket, setOpenTicket] = useState<boolean>(false);
  const {
    footerwrapper,
    container,
    footermain,
    aboutpill,
    socials,
    footerlogo,
    footerlinks,
    footercopyright,
  } = styles;

  useEffect(() => {
    const bodyElement = document.body;

    if (openTicket) {
      bodyElement.style.overflow = 'hidden';
      bodyElement.style.height = '100vh';
    }

    return () => {
      bodyElement.style.overflow = 'scroll';
      bodyElement.style.height = 'auto';
    };
  }, [openTicket]);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      new FooterAnimation(footerwrapper);

      isInitialized.current = true;
    }
  }, []);
  return (
    <footer className={footerwrapper}>
      <div className={container}>
        <div className={footermain}>
          <div>
            <div data-animate-scale data-easing='SCALE' className={aboutpill}>
              <p data-animate-y-up data-delay='0.333'>
                About this event
              </p>
            </div>
            <p data-animate-sentences data-delay='0.083'>
              This event is organized by Google Developer Group Lagos (GDG Lagos) Devfest Lagos is
              an annual conference for tech enthusiasts ranging from novice to leaders in the
              industry. The event features sessions on Mental Health, Mobile, Design, Web, Cloud,
              DevOps, Machine Learning, AR/VR, and many more.{' '}
            </p>
            <p data-animate-sentences data-delay='0.5'>
              This year, Devfest Lagos will take place between 15th and 16th November 2024, at
              Landmark Events Center, Lagos. The sessions are in parallel; register for sessions
              that fit your profile or things you&apos;d like to learn about.
            </p>
            <div className={socials}>
              <p data-animate-y-up data-delay='0.75'>
                Follow us on:
              </p>
              <div>
                {socialMedia.map((social, key) => (
                  <a
                    href={social.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    key={key}
                    aria-label={`Follow us on ${social.title}`}
                    data-animate-scale
                    data-delay={key / 10 + 0.833}
                    data-easing='SCALE'
                  >
                    <Image
                      src={`/icons/${social.title}-icon.svg`}
                      alt={`${social.title}`}
                      width={30}
                      height={20}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className={footerlogo}>
              <Image
                src={'/devfest-logo.svg'}
                alt='DevFest Lagos Logo'
                width={300}
                height={94}
                layout='responsive'
              />
            </div>

            <Button
              data-animate-scale
              data-delay='0.167'
              data-easing='SCALE'
              text={
                <span data-animate-text data-delay='0.4'>
                  Get Early Bird Tickets
                </span>
              }
            />
            <Button onClick={() => setOpenTicket(true)} text='Get Early Bird Tickets' />

            <div className={footerlinks}>
              <ul>
                {footerLinks.slice(0, 3).map(({ link, title }, key) => (
                  <li data-animate-y-up data-delay={key / 10 + 0.25} key={key}>
                    <a href={link} target='_blank' rel='noopener noreferrer' aria-label={title}>
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
              <ul>
                {footerLinks.slice(3, 5).map(({ link, title }, key) => (
                  <li data-animate-y-up data-delay={key / 10 + 0.5} key={key}>
                    <a href={link} target='_blank' rel='noopener noreferrer' aria-label={title}>
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
              <ul>
                {footerLinks.slice(5, 7).map(({ link, title }, key) => (
                  <li data-animate-y-up data-delay={key / 10 + 0.67} key={key}>
                    <a href={link} target='_blank' rel='noopener noreferrer' aria-label={title}>
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <p data-animate-text data-delay={0.1} className={footercopyright}>
          © {currentYear} Devfest Lagos. All Rights Reserved.
        </p>
      </div>
      {/* Modals */}
      <Modal showHeader open={openTicket} onClose={() => setOpenTicket(false)}>
        <PurchaseTicket />
      </Modal>
    </footer>
  );
};
