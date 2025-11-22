import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { LocationData } from '../../types';
import { Button } from '../../components/ui/Button';
import { ArrowPathIcon } from '../../components/icons/Icons';
import { useLocalization } from '../../contexts/LocalizationContext';

export const LocationPage: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const childName = localStorage.getItem('childName') || 'your child';
  const { t } = useLocalization();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        });
        setError(null); // Clear previous errors on successful watch update
      },
      (geoError) => {
        let errorMessage = 'An unknown error occurred.';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = "Permission to access location was denied. Please check your browser settings to allow location access for this site.";
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = "Location information is currently unavailable. Please check your device's location services.";
            break;
          case geoError.TIMEOUT:
            errorMessage = "The request to get user location timed out. Please try again.";
            break;
        }
        setError(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Cleanup function to stop watching location when component unmounts
    return () => navigator.geolocation.clearWatch(watchId);
  }, []); // Empty dependency array means this effect runs once on mount

  const handleRefresh = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsRefreshing(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        });
        setIsRefreshing(false);
      },
      (geoError) => {
        let errorMessage = 'An unknown error occurred.';
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = "Permission to access location was denied. Please check your browser settings to allow location access for this site.";
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = "Location information is currently unavailable. Please check your device's location services.";
            break;
          case geoError.TIMEOUT:
            errorMessage = "The request to get user location timed out. Please try again.";
            break;
        }
        setError(errorMessage);
        setIsRefreshing(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="font-semibold text-red-600 dark:text-red-400">{t('couldNotRetrieveLocation')}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {error}
            </p>
        </div>
      );
    }

    if (!location) {
      return (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 dark:text-slate-400">{t('acquiringSatellite')}</p>
        </div>
      );
    }
    
    const mapUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&hl=en&z=16&output=embed`;
    
    return (
      <div>
        <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-primary-500">
            <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 space-y-1">
            <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('lastUpdated')}</span> {new Date(location.timestamp).toLocaleTimeString()}</p>
            <p><span className="font-semibold text-slate-800 dark:text-slate-100">{t('coordinates')}</span> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('locationOf', { childName })}</h1>
            <Button onClick={handleRefresh} disabled={isRefreshing} variant="secondary" className="flex items-center">
                <ArrowPathIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="ml-2 hidden sm:inline">{isRefreshing ? t('refreshing') : t('refresh')}</span>
            </Button>
        </div>
        
        {renderContent()}
        
        <div className="text-center mt-6">
            <Link to="/parent/dashboard">
                <Button variant="secondary">{t('backToDashboard')}</Button>
            </Link>
        </div>
      </Card>
    </div>
  );
};