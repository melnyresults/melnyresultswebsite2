import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TrackingScripts = () => {
  useEffect(() => {
    loadGA4Script();
  }, []);

  const loadGA4Script = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'ga4_measurement_id')
        .maybeSingle();

      if (error || !data || !data.setting_value) {
        return;
      }

      const measurementId = data.setting_value;

      if (measurementId && measurementId.startsWith('G-')) {
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `;
        document.head.appendChild(script2);
      }
    } catch (err) {
      console.error('Error loading GA4:', err);
    }
  };

  return null;
};

export default TrackingScripts;
