import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  Shield,
  Phone,
  Truck,
  CreditCard,
} from "lucide-react";

// FAQs page with accordion-style expandable questions
const FAQs = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0); // First FAQ open by default

  // FAQ data organized by categories
  const faqCategories = [
    {
      title: "أسئلة عامة",
      icon: HelpCircle,
      color: "text-primary",
      faqs: [
        {
          question: "ما هي خدمة توصيل الأدوية؟",
          answer:
            "نحن نقدم خدمة توصيل الأدوية السريعة والآمنة في الدار البيضاء. نتعاون مع أفضل الصيدليات لضمان وصول دوائك إلى باب منزلك في أسرع وقت ممكن.",
        },
        {
          question: "في أي مناطق تقدمون الخدمة؟",
          answer:
            "نقدم خدماتنا حالياً في جميع أنحاء الدار البيضاء، بما في ذلك المناطق التالية: أنفا، المعاريف، الحي الحسني، سيدي البرنوصي، عين الشق، والمدينة القديمة. نعمل على توسيع نطاق خدماتنا لتشمل مناطق أخرى قريباً.",
        },
        {
          question: "هل الخدمة متاحة طوال اليوم؟",
          answer:
            "نعم، خدمة توصيل الأدوية متاحة 24 ساعة في اليوم، 7 أيام في الأسبوع. لدينا صيدليات شريكة تعمل في أوقات مختلفة لضمان تغطية شاملة.",
        },
      ],
    },
    {
      title: "التوصيل والأوقات",
      icon: Truck,
      color: "text-secondary",
      faqs: [
        {
          question: "كم من الوقت يستغرق توصيل الدواء؟",
          answer:
            "متوسط وقت التوصيل هو 15-30 دقيقة من وقت تأكيد الطلب. في بعض الحالات الاستثنائية أو المناطق البعيدة، قد يستغرق التوصيل حتى 45 دقيقة.",
        },
        {
          question: "هل يمكنني تحديد وقت معين للتوصيل؟",
          answer:
            "نعم، يمكنك طلب التوصيل في وقت محدد عند تعبئة النموذج. سنبذل قصارى جهدنا لتلبية طلبك، لكن التوصيل الفوري يبقى أولويتنا في الحالات الطارئة.",
        },
        {
          question: "ماذا لو لم أكن متواجداً وقت التوصيل؟",
          answer:
            "سيتصل بك المندوب قبل الوصول بـ5-10 دقائق. إذا لم تكن متواجداً، يمكن ترك الدواء مع شخص بالغ موثوق، أو يمكننا إعادة جدولة التوصيل لوقت آخر.",
        },
        {
          question: "هل تقدمون خدمة التوصيل في الأيام العطل؟",
          answer:
            "نعم، نقدم خدماتنا في جميع أيام الأسبوع بما في ذلك العطل الرسمية والأعياد، لأننا ندرك أن الحاجة للدواء لا تتوقف.",
        },
      ],
    },
    {
      title: "الطلب والدفع",
      icon: CreditCard,
      color: "text-primary",
      faqs: [
        {
          question: "كيف يمكنني طلب دواء؟",
          answer:
            "يمكنك طلب الدواء بثلاث طرق: 1) ملء النموذج على موقعنا، 2) الاتصال بنا مباشرة، 3) إرسال صورة الوصفة الطبية عبر WhatsApp. سنتواصل معك لتأكيد الطلب.",
        },
        {
          question: "ما هي طرق الدفع المتاحة؟",
          answer:
            "نقبل الدفع نقداً عند التسليم، والدفع عبر البطاقة البنكية، وكذلك التحويلات البنكية. نعمل على إضافة المزيد من خيارات الدفع الإلكتروني قريباً.",
        },
        {
          question: "هل يمكنني إلغاء أو تعديل طلبي؟",
          answer:
            "نعم، يمكنك إلغاء أو تعديل طلبك قبل خروج المندوب من الصيدلية. اتصل بنا في أسرع وقت ممكن على الرقم المتاح 24/7.",
        },
        {
          question: "هل هناك حد أدنى لقيمة الطلب؟",
          answer:
            "لا يوجد حد أدنى لقيمة الطلب. نحن نوصل حتى الأدوية البسيطة لأننا نؤمن بأن كل دواء مهم لصحتك.",
        },
      ],
    },
    {
      title: "الأمان والجودة",
      icon: Shield,
      color: "text-secondary",
      faqs: [
        {
          question: "كيف تضمنون جودة الأدوية؟",
          answer:
            "نتعامل فقط مع صيدليات مرخصة ومعتمدة من وزارة الصحة. جميع الأدوية أصلية ومضمونة الجودة، ونحتفظ بسجلات تتبع كاملة لكل عملية توصيل.",
        },
        {
          question: "هل الأدوية آمنة أثناء النقل؟",
          answer:
            "نعم، لدينا حقائب خاصة لحفظ الأدوية في درجات الحرارة المناسبة، خاصة للأدوية التي تحتاج لتبريد. كما نستخدم عبوات آمنة لمنع تلف الأدوية أثناء النقل.",
        },
        {
          question: "ماذا لو وصل الدواء تالفاً؟",
          answer:
            "في حالة وصول الدواء تالفاً أو منتهي الصلاحية، نعوضك فوراً بدواء جديد مجاناً. نحن نضمن جودة خدمتنا 100%.",
        },
        {
          question: "هل تحتفظون بسرية المعلومات الطبية؟",
          answer:
            "نعم، نلتزم بأعلى معايير السرية والخصوصية. جميع المعلومات الطبية والشخصية محمية ولا نشاركها مع أي طرف ثالث.",
        },
      ],
    },
    {
      title: "خدمة العملاء",
      icon: Phone,
      color: "text-primary",
      faqs: [
        {
          question: "كيف يمكنني التواصل معكم؟",
          answer:
            "يمكنك التواصل معنا عبر الهاتف على +212 6XX-XXX-XXX، أو عبر البريد الإلكتروني info@medicine-casa.ma، أو عبر نموذج الاتصال على الموقع. خدمة العملاء متاحة 24/7.",
        },
        {
          question: "هل يمكنني تتبع طلبي؟",
          answer:
            "نعم، بمجرد تأكيد طلبك ستحصل على رقم متابعة. يمكنك الاتصال بنا لمعرفة حالة طلبك، وسنرسل لك رسائل تحديث عبر SMS.",
        },
        {
          question: "ماذا لو كان لدي شكوى؟",
          answer:
            "نحن نقدر ملاحظاتك وشكاواك. يمكنك تقديم الشكوى عبر الهاتف أو البريد الإلكتروني، وسنرد عليك خلال 24 ساعة مع حل مناسب.",
        },
        {
          question: "هل تقدمون استشارات صيدلانية؟",
          answer:
            "نعم، يمكنك طلب استشارة صيدلانية مجانية عند الطلب. لدينا صيادلة مؤهلون يمكنهم تقديم النصائح حول استخدام الأدوية وتفاعلاتها.",
        },
      ],
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Flatten all FAQs with category information
  const allFAQs = faqCategories.flatMap((category, categoryIndex) =>
    category.faqs.map((faq, faqIndex) => ({
      ...faq,
      categoryTitle: category.title,
      categoryIcon: category.icon,
      categoryColor: category.color,
      globalIndex: categoryIndex * 10 + faqIndex, // Unique index for each FAQ
    }))
  );

  return (
    <div className="min-h-screen py-12 px-4" data-aos="fade-up">
      <div className="container mx-auto max-w-4xl">
        {/* Page header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-medium animate-pulse-glow">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-arabic-display text-4xl font-bold mb-4 text-gradient">
            الأسئلة الشائعة
          </h1>
          <p className="font-arabic text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            إجابات على أكثر الأسئلة شيوعاً حول خدمة توصيل الأدوية
          </p>
        </div>

        {/* Quick stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {[
            { icon: Clock, value: "15 دقيقة", label: "متوسط التوصيل" },
            { icon: Shield, value: "100%", label: "أدوية أصلية" },
            { icon: Phone, value: "24/7", label: "دعم العملاء" },
            { icon: Truck, value: "+500", label: "طلب موصل" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="text-center bg-gradient-card border-0 shadow-soft"
            >
              <CardContent className="p-4">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="font-bold text-lg text-primary">
                  {stat.value}
                </div>
                <div className="font-arabic text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Categories */}
        <div
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          {faqCategories.map((category, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-lg bg-accent/20 border"
            >
              <category.icon
                className={`w-8 h-8 mx-auto mb-2 ${category.color}`}
              />
              <h3 className="font-arabic-display text-sm font-semibold">
                {category.title}
              </h3>
              <p className="font-arabic text-xs text-muted-foreground mt-1">
                {category.faqs.length} سؤال
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
          {allFAQs.map((faq, index) => (
            <Card
              key={index}
              className={`shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 h-auto justify-between hover:bg-accent/50 rounded-lg"
                >
                  <div className="flex items-start space-x-4 space-x-reverse text-right">
                    <faq.categoryIcon
                      className={`w-5 h-5 mt-1 flex-shrink-0 ${faq.categoryColor}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-arabic-display text-lg font-semibold text-right leading-relaxed">
                        {faq.question}
                      </h3>
                      <p className="font-arabic text-sm text-muted-foreground text-right mt-1">
                        {faq.categoryTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 mr-4">
                    {openFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </Button>

                {openFAQ === index && (
                  <div className="px-6 pb-6 animate-fade-in-up">
                    <div className="pr-9 border-r-2 border-primary/20">
                      <p className="font-arabic text-muted-foreground leading-relaxed text-right">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact section */}
        <Card
          className="mt-12 bg-gradient-card shadow-medium"
          data-aos="fade-up"
          data-aos-delay="250"
        >
          <CardContent className="p-8 text-center">
            <h2 className="font-arabic-display text-2xl font-bold mb-4">
              لم تجد إجابة لسؤالك؟
            </h2>
            <p className="font-arabic text-muted-foreground mb-6 leading-relaxed">
              فريق خدمة العملاء مستعد لمساعدتك في أي وقت
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary rtl-flip" />
                </div>
                <h3 className="font-arabic-display font-semibold mb-1">
                  اتصل بنا
                </h3>
                <p className="font-arabic text-sm text-muted-foreground">
                  {" "}
                  455 455 666 212+
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-arabic-display font-semibold mb-1">
                  البريد الإلكتروني
                </h3>
                <p className="font-arabic text-sm text-muted-foreground">
                  info@medicine-casa.ma
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-arabic-display font-semibold mb-1">
                  ساعات العمل
                </h3>
                <p className="font-arabic text-sm text-muted-foreground">
                  24 ساعة، 7 أيام
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="font-arabic">
                <Phone className="w-4 h-4 ml-2 rtl-flip" />
                اتصل بنا الآن
              </Button>
              <Button variant="outline" className="font-arabic">
                <HelpCircle className="w-4 h-4 ml-2" />
                أرسل سؤالك
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQs;
