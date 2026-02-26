import apiClient from './axios';
import { API_ENDPOINTS } from '@/config/api';

// Types based on user's request
export interface LockRoomRequest {
    hotelId: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
}

export interface LockRoomResponse {
    hotelId: string;
    roomId: string;
    roomNo: number;
    roomType: string;
    checkIn: string;
    checkOut: string;
    roomPrice: number;
    platformCharges: number;
    taxAmount: number | null;
    taxRate: number;
    totalPrice: number | null; // This might be null based on response
    lockExpiry: string;
}

export interface CreateBookingRequest {
    lockRoomId: string;
    adults: number;
    children: number;
    paymentType: "Advance" | "Full" | "Pay at Hotel"; // Adjust based on actual backend enum
    name: string;
    countryCode: string;
    phoneNo: string;
    checkIn: string;
    checkOut: string;
}

export interface CreateBookingResponse {
    bookingId: string;
    bookingStatus: string;
    paymentStatus: string;
    roomPrice: number;
    platformCharges: number;
    taxAmount: number;
    createdAt: string;
    checkIn: string;
    checkOut: string;
    duration: number;
    advanceRate: number;
    totalAmount_ADV: number;
    totalAmount: number;
    paymentType: string;
}

export interface RazorpayOrderRequest {
    bookingId: string;
    amount: number;
}

export interface RazorpayOrderResponse {
    razorpayOrderId: string;
    currency: string;
    amount: number;
}

export interface RazorpayVerifyRequest {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export interface RazorpayVerifyResponse {
    message: string;
    bookingId: string;
    status: string;
}


// API Functions
export const lockRoom = async (data: LockRoomRequest): Promise<LockRoomResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.LOCK_ROOM, data);
    return response.data;
};

export const createBooking = async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    // Use CONFIRM_BOOKING endpoint which maps to /booking/create
    const response = await apiClient.post(API_ENDPOINTS.CONFIRM_BOOKING, data);
    return response.data;
};

export const createRazorpayOrder = async (data: RazorpayOrderRequest): Promise<RazorpayOrderResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.RAZORPAY_ORDER, data);
    return response.data;
};

export const verifyRazorpayPayment = async (data: RazorpayVerifyRequest): Promise<RazorpayVerifyResponse> => {
    const response = await apiClient.post(API_ENDPOINTS.RAZORPAY_VERIFY, data);
    return response.data;
};

export interface BookingDetailsResponse {
    status: number;
    message: string;
    data: {
        name: string;
        phone_number: string;
        booking_ID: string;
        user_ID: number;
        hotel_ID: string;
        hotel_name: string;
        room_ID: string;
        RoomNumber: number;
        booking_Status: string;
        checkIn: string;
        checkOut: string;
        payment_Status: string;
        payment_type: string;
        is_refundable: boolean;
        tax_amount: number;
        platformFee: number;
        "Room Price": number;
        "amount paid by customer": number;
        "payment left to pay customer": number;
        "gross amount to be paid by customer": number;
    };
}

export const getBookingDetails = async (bookingId: string): Promise<BookingDetailsResponse> => {
    const url = API_ENDPOINTS.GET_BOOKING_DETAILS.replace(':bookingId', bookingId);
    const response = await apiClient.get(url);
    return response.data;
};
