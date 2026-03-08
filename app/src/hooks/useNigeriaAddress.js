import { useState, useCallback } from 'react';
import { STATES, getLGAs, getCities } from '../data/nigeriaAddressData';

export function useNigeriaAddress(initial = {}) {
  const [address, setAddress] = useState({
    state:    initial.state    || '',
    lga:      initial.lga      || '',
    city:     initial.city     || '',
    street:   initial.street   || '',
    street2:  initial.street2  || '',
    landmark: initial.landmark || '',
    postcode: initial.postcode || '',
  });

  const handleStateChange = useCallback((e) => {
    setAddress((p) => ({ ...p, state: e.target.value, lga: '', city: '' }));
  }, []);

  const handleLGAChange = useCallback((e) => {
    setAddress((p) => ({ ...p, lga: e.target.value, city: '' }));
  }, []);

  const handleCityChange   = useCallback((e) => setAddress((p) => ({ ...p, city:     e.target.value })), []);
  const handleStreetChange = useCallback((e) => setAddress((p) => ({ ...p, street:   e.target.value })), []);
  const handleStreet2Change= useCallback((e) => setAddress((p) => ({ ...p, street2:  e.target.value })), []);
  const handleLandmarkChange=useCallback((e) => setAddress((p) => ({ ...p, landmark: e.target.value })), []);
  const handlePostcodeChange=useCallback((e) => setAddress((p) => ({ ...p, postcode: e.target.value })), []);
  const resetAddress       = useCallback(() =>
    setAddress({ state:'', lga:'', city:'', street:'', street2:'', landmark:'', postcode:'' }), []);
  const setAddressValues   = useCallback((v) => setAddress((p) => ({ ...p, ...v })), []);

  const lgas   = getLGAs(address.state);
  const cities = getCities(address.state, address.lga);

  const fullAddress = [
    address.street,
    address.street2,
    address.city,
    address.lga,
    address.state,
    address.postcode,
    'Nigeria',
  ].filter(Boolean).join(', ');

  const isAddressComplete = Boolean(
    address.state && address.lga && address.city && address.street.trim().length >= 3
  );

  return {
    address,
    handlers: {
      handleStateChange, handleLGAChange, handleCityChange,
      handleStreetChange, handleStreet2Change, handleLandmarkChange,
      handlePostcodeChange, resetAddress, setAddressValues,
    },
    derived: {
      states: STATES,
      lgas,
      cities,
      fullAddress,
      isAddressComplete,
    },
  };
}