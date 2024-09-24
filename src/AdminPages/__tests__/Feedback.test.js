import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Feedback from '../Feedback';
import axios from 'axios';

jest.mock('axios'); // Mock axios to prevent actual API calls

describe('Feedback Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Simulate loading state
    render(<Feedback />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message when fetching feedbacks fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch feedbacks'));
    
    render(<Feedback />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch feedbacks')).toBeInTheDocument();
    });
  });

  it('renders feedbacks correctly', async () => {
    const feedbackData = {
      internetServiceFeedbacks: [
        { feedbackId: 1, username: 'User1', feedback: 'Great service!', internetService: { serviceName: 'Fast Internet' } },
      ],
      tvServiceFeedbacks: [
        { feedbackId: 2, username: 'User2', feedback: 'Loved the channels!', tvService: { serviceName: 'Premium TV' } },
      ],
    };

    axios.get.mockResolvedValueOnce({ data: feedbackData });

    render(<Feedback />);
    
    await waitFor(() => {
      expect(screen.getByText('Internet Service Feedbacks')).toBeInTheDocument();
      expect(screen.getByText('Great service!')).toBeInTheDocument();
      expect(screen.getByText('TV Service Feedbacks')).toBeInTheDocument();
      expect(screen.getByText('Loved the channels!')).toBeInTheDocument();
    });
  });

  it('handles next and previous feedback for internet services', async () => {
    const feedbackData = {
      internetServiceFeedbacks: [
        { feedbackId: 1, username: 'User1', feedback: 'Great service!', internetService: { serviceName: 'Fast Internet' } },
        { feedbackId: 2, username: 'User2', feedback: 'Good speed!', internetService: { serviceName: 'Superfast Internet' } },
      ],
      tvServiceFeedbacks: [],
    };

    axios.get.mockResolvedValueOnce({ data: feedbackData });

    render(<Feedback />);

    await waitFor(() => screen.getByText('Great service!'));
    
    // Click next button
    fireEvent.click(screen.getByText('Next'));
    
    await waitFor(() => {
      expect(screen.getByText('Good speed!')).toBeInTheDocument();
    });
    
    // Click previous button
    fireEvent.click(screen.getByText('Previous'));
    
    await waitFor(() => {
      expect(screen.getByText('Great service!')).toBeInTheDocument();
    });
  });

  it('opens and closes feedback detail popup', async () => {
    const feedbackData = {
      internetServiceFeedbacks: [
        { feedbackId: 1, username: 'User1', feedback: 'Great service!', internetService: { serviceName: 'Fast Internet' } },
      ],
      tvServiceFeedbacks: [],
    };

    axios.get.mockResolvedValueOnce({ data: feedbackData });

    render(<Feedback />);

    await waitFor(() => screen.getByText('Great service!'));

    // Open popup
    fireEvent.click(screen.getByText('View Details'));

    await waitFor(() => {
      expect(screen.getByText('Feedback Details')).toBeInTheDocument();
    });

    // Close popup
    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText('Feedback Details')).not.toBeInTheDocument();
    });
  });
});
