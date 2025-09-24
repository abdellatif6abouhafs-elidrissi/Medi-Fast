import { Link } from "react-router-dom";
import {
  Pill,
  Phone,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// Footer component with contact information and social links
const Footer = () => {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-card border-t mt-auto" data-aos="fade-up">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="space-y-4" data-aos="fade-up" data-aos-delay="50">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Pill className="w-8 h-8 text-primary" />
              <span className="font-arabic-display font-bold text-xl text-gradient">
                توصيل الأدوية
              </span>
            </div>
            <p className="font-arabic text-muted-foreground leading-relaxed">
              نوفر خدمة توصيل الأدوية السريعة والآمنة في الدار البيضاء، مع ضمان
              جودة الخدمة والالتزام بالمواعيد.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
            <h3 className="font-arabic-display font-semibold text-lg">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="font-arabic text-muted-foreground hover:text-primary transition-smooth"
                >
                  الرئيسية
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link
                    to="/order"
                    className="font-arabic text-muted-foreground hover:text-primary transition-smooth"
                  >
                    طلب دواء
                  </Link>
                </li>
              )}
              <li>
                <Link
                  to="/pharmacy-partners"
                  className="font-arabic text-muted-foreground hover:text-primary transition-smooth"
                >
                  الصيدليات الشريكة
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="font-arabic text-muted-foreground hover:text-primary transition-smooth"
                >
                  الأسئلة الشائعة
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact information */}
          <div className="space-y-4" data-aos="fade-up" data-aos-delay="150">
            <h3 className="font-arabic-display font-semibold text-lg">
              معلومات التواصل
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <Phone className="w-5 h-5 text-primary rtl-flip" />
                <span className="font-arabic text-muted-foreground" dir="ltr">
                  +212 625034547
                </span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Mail className="w-5 h-5 text-primary" />
                <span className="font-arabic text-muted-foreground">
                  pharma-medicine-casa.ma
                </span>
              </div>
              <div className="flex items-start space-x-3 space-x-reverse">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <span className="font-arabic text-muted-foreground leading-relaxed">
                  الدار البيضاء - عمالة أنفا
                  <br />
                  المغرب
                </span>
              </div>
            </div>
          </div>

          {/* Social media links */}
          <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
            <h3 className="font-arabic-display font-semibold text-lg">
              تابعونا
            </h3>
            <div className="flex space-x-4 space-x-reverse">
              <a
                href="https://www.facebook.com/"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-smooth"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="font-arabic text-sm text-muted-foreground">
              للحصول على آخر الأخبار والعروض الخاصة
            </p>
          </div>
        </div>

        {/* Copyright and owner information */}
        <div
          className="border-t mt-8 pt-8 text-center"
          data-aos="fade-up"
          data-aos-delay="250"
        >
          <p className="font-arabic text-muted-foreground text-sm">
            © {currentYear} توصيل الأدوية - جميع الحقوق محفوظة
          </p>
          <p className="font-arabic text-muted-foreground text-xs mt-1">
            مملوك من طرف: عبداللطيف ابوحفص الإدريسي
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
