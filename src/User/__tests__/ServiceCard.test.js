import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServiceCard from '../ServiceCard'; // Adjust the import path if needed

describe('ServiceCard Component', () => {
    const service = {
        serviceId: '1',
        serviceName: 'Premium Service',
        serviceType: 'Type A',
        description: 'A high-quality service.',
        benefits: 'Speed, Reliability',
        serviceDownloadSpeed: '100',
        serviceUploadSpeed: '50',
        cost: '500',
        validity: '30'
    };

    it('should call onSubscribe when button is clicked and isButtonDisabled is false', () => {
        const onSubscribe = jest.fn();
        render(<ServiceCard service={service} isSubscribed={false} isRequested={false} onSubscribe={onSubscribe} isButtonDisabled={false} onDisabledClick={() => {}} />);

        fireEvent.click(screen.getByText('Subscribe'));

        expect(onSubscribe).toHaveBeenCalledWith(service.serviceId, service.serviceName, service.serviceType);
    });

    it('should disable the button when isButtonDisabled is true', () => {
        render(<ServiceCard service={service} isSubscribed={false} isRequested={false} onSubscribe={() => {}} isButtonDisabled={true} onDisabledClick={() => {}} />);

        expect(screen.getByText('Subscribe')).toBeDisabled();
    });
});
