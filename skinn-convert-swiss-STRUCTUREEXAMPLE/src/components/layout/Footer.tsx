
import React from "react";
import { Link } from "react-router-dom";
import MyantLogo from "@/components/ui/MyantLogo";
import { useTranslation } from "@/hooks/useTranslation";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const t = useTranslation('home');

  return (
    <footer className="bg-secondary-foreground text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <MyantLogo className="invert" />
            <p className="text-sm opacity-80 max-w-xs">
              {t.footer.tagline}
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/myant/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <span className="sr-only">LinkedIn</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 9H2V21H6V9Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a href="https://twitter.com/myant_health" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <span className="sr-only">Twitter</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 4C22 4 21.3 6.1 20 7.4C21.6 17.4 10.6 24.7 2 19C4.2 19.1 6.4 18.4 8 17C3 15.5 0.5 9.6 3 5C5.2 7.6 8.6 9.1 12 9C11.1 4.8 16 2.4 19 5.2C20.1 5.2 22 4 22 4Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a href="https://www.instagram.com/myant_health/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <span className="sr-only">Instagram</span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4077 15.9059C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1902 8.22768 13.4229 8.09402 12.5922C7.96035 11.7616 8.09202 10.9099 8.47028 10.1584C8.84854 9.40685 9.45414 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.5 6.5H17.51"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">{t.footer.sections.patients.title}</h3>
            <ul className="space-y-2 text-sm">
              {/* Temporarily removed until pages are created
              <li>
                <Link to="/patients" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.patients.links.main}
                </Link>
              </li>
              <li>
                <Link to="/patients/testimonials" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.patients.links.testimonials}
                </Link>
              </li>
              <li>
                <Link to="/patients/faq" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.patients.links.faq}
                </Link>
              </li>
              */}
              <li>
                <a 
                  href="https://skiin-support.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  {t.footer.sections.patients.links.support}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">{t.footer.sections.physicians.title}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/partners" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.physicians.links.main}
                </Link>
              </li>
              {/* Temporarily removed until pages are created
              <li>
                <Link to="/physicians/research" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.physicians.links.research}
                </Link>
              </li>
              <li>
                <Link to="/physicians/resources" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.physicians.links.resources}
                </Link>
              </li>
              */}
              <li>
                <a 
                  href="https://skiin-support.netlify.app/physicians" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  {t.footer.sections.physicians.links.support}
                </a>
              </li>
              <li>
                <Link to="/request-demo" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.physicians.links.requestDemo}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-lg">{t.footer.sections.company.title}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.company.links.about}
                </Link>
              </li>
              {/* Temporarily removed until pages are created
              <li>
                <Link to="/team" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.company.links.team}
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.company.links.careers}
                </Link>
              </li>
              */}
              <li>
                <Link to="/about/contact" className="hover:underline opacity-80 hover:opacity-100">
                  {t.footer.sections.company.links.contact}
                </Link>
              </li>
              <li>
                <a 
                  href="https://skiin-support.netlify.app/contact" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:underline opacity-80 hover:opacity-100"
                >
                  {t.footer.sections.company.links.support}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4 text-xs opacity-70">
              <Link to="/privacy" className="hover:underline">
                {t.footer.legal.privacy}
              </Link>
              <Link to="/terms" className="hover:underline">
                {t.footer.legal.terms}
              </Link>
              <Link to="/cookies" className="hover:underline">
                {t.footer.legal.cookies}
              </Link>
            </div>
            <p className="text-xs opacity-70">
              © {currentYear} Myant Health. {t.footer.legal.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
