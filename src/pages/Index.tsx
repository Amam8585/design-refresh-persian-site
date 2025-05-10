
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { 
  Headset, 
  Package, 
  User, 
  Store,
  Tag,
  Globe,
  Check,
  Settings,
  User as UserIcon,
  ShoppingCart,
  LoaderCircle
} from "lucide-react";

interface ItemData {
  trackingCode: string;
  region: string;
  linkType: string;
  cpCount: string;
  battlePass: string;
  sellDesc: string;
  lease: string;
  sellPrice: string;
  media: string[];
}

const Index = () => {
  const [item, setItem] = useState<ItemData | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    
    if (!code) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    fetch('acc.json?cb=' + Date.now(), {
      cache: 'no-store'
    })
      .then(r => r.json())
      .then(data => {
        const foundItem = data.find((o: ItemData) => o.trackingCode === code);
        if (foundItem) {
          setItem(foundItem);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [location]);

  const handleAddToCart = () => {
    if (!item) return;
    
    fetch(`addCart.php?code=${encodeURIComponent(item.trackingCode)}&price=${encodeURIComponent(item.sellPrice)}`)
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          toast({
            title: "موفق ✓",
            description: "محصول با موفقیت به سبد خرید اضافه شد",
            className: "bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-900",
            duration: 3000,
          });
        } else if (res.error === 'duplicate') {
          toast({
            variant: "destructive",
            title: "خطا",
            description: "این محصول قبلاً به سبد خرید اضافه شده است",
            duration: 3000,
          });
        } else {
          toast({
            variant: "destructive",
            title: "خطا",
            description: "مشکلی در افزودن محصول به سبد خرید رخ داد",
            duration: 3000,
          });
        }
      });
  };

  const openLightbox = (imgSrc: string) => {
    setSelectedImage(imgSrc);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <LoaderCircle className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-muted-foreground">محصولی یافت نشد</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b z-50 shadow-sm">
        <div className="container mx-auto flex justify-between items-center h-[72px] px-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://arianstore.org/img/IMG_5979.jpeg" 
              alt="آرین استور" 
              className="w-10 h-10 rounded-full"
            />
            <span className="font-bold text-lg">آرین استور</span>
          </div>
          <Button asChild variant="outline" className="bg-gradient-to-r from-[#3fff7c] to-[#3ffbe0] text-black border-none hover:opacity-90 font-bold">
            <a href="/">خانه</a>
          </Button>
        </div>
      </header>
      
      <main className="pt-16 pb-32">
        {/* Gallery Section */}
        <div className="my-6">
          {item.media && item.media.length > 0 ? (
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                {item.media.map((image, index) => (
                  <CarouselItem key={index} className="flex justify-center">
                    <img
                      src={`/image/${image}`}
                      alt={`تصویر ${index + 1}`}
                      className="rounded-lg object-cover h-[250px] md:h-[350px] cursor-pointer"
                      onClick={() => openLightbox(`/image/${image}`)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <div className="bg-muted h-[200px] rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">تصویری موجود نیست</p>
            </div>
          )}
        </div>

        {/* Details Section */}
        <Card className="my-8 border bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-xl md:text-2xl text-center">مشخصات اکانت</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <DetailItem icon={<Tag size={18} />} title="کد آگهی‌ اکانت" value={item.trackingCode} />
            <DetailItem icon={<Globe size={18} />} title="ریجن‌ اکانت" value={item.region} />
            <DetailItem icon={<Settings size={18} />} title="لینک ‌اکانت" value={item.linkType} />
            <DetailItem icon={<Check size={18} />} title="تعداد‌ سیپی" value={item.cpCount} />
            <DetailItem icon={<Check size={18} />} title="وضعیت ‌بتل ‌پس" value={item.battlePass} />
            <DetailItem icon={<Check size={18} />} title="توضیحات ‌فروشنده" value={item.sellDesc} />
            <DetailItem icon={<UserIcon size={18} />} title="تضمین ‌با‌ احراز ‌هویت" value={item.lease} />
            <DetailItem icon={<Check size={18} />} title="قیمت ‌اکانت به تومان" value={item.sellPrice} highlight />
            <DetailItem icon={<UserIcon size={18} />} title="مدیریت ‌واسطه" value="@Ar_broken" />
            <DetailItem icon={<UserIcon size={18} />} title="ادمین ‌معاملات ‌سایت" value="@Adm_Site" />
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Button 
              onClick={handleAddToCart} 
              className="w-full max-w-md py-6 text-lg font-bold bg-gradient-to-r from-[#3fff7c] to-[#3ffbe0] text-black hover:opacity-90"
            >
              افزودن به سبد خرید
            </Button>
          </CardFooter>
        </Card>
      </main>

      {/* Bottom Navigation with more spacing above */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-40">
        <div className="max-w-md mx-auto flex justify-around items-center h-[72px]">
          <NavItem href="https://t.me/Ar_broken" icon={<Headset size={22} />} label="پشتیبانی" />
          <NavItem href="https://arianstore.org/indext.php" icon={<Package size={22} />} label="ثبت اگهی" />
          <NavItem 
            href="https://arianstore.org/bos.html" 
            icon={<ShoppingCart size={28} className="text-black" />} 
            label="" 
            className="relative -mt-8 bg-gradient-to-r from-[#3fff7c] to-[#3ffbe0] p-4 rounded-full shadow-lg" 
          />
          <NavItem href="https://arianstore.org" icon={<User size={22} />} label="خانه" />
          <NavItem href="https://arianstore.org/Por.html" icon={<Store size={22} />} label="محصولات" />
        </div>
      </nav>

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setLightboxOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white text-2xl" 
            onClick={() => setLightboxOpen(false)}
          >
            &times;
          </button>
          <img 
            src={selectedImage} 
            alt="تصویر بزرگ" 
            className="max-w-[90%] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  highlight?: boolean;
}

const DetailItem = ({ icon, title, value, highlight = false }: DetailItemProps) => {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${highlight ? 'bg-primary/10 border border-primary/20' : 'border'}`}>
      <div className={`text-primary mt-1 ${highlight ? 'text-primary' : ''}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className={`text-sm ${highlight ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{value}</p>
      </div>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const NavItem = ({ href, icon, label, className = "" }: NavItemProps) => {
  return (
    <a 
      href={href} 
      className={`flex flex-col items-center gap-1 text-xs ${className ? className : "text-[#45d1b0]"}`}
    >
      <span className={className ? "text-black" : ""}>{icon}</span>
      {label && <span>{label}</span>}
    </a>
  );
};

export default Index;
