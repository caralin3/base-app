import { Address } from '@base-app/core';
/* eslint-disable @typescript-eslint/no-redeclare */
import { z } from 'zod';

export const PlaceStatus = z.enum(['idea', 'planned']);
export type PlaceStatus = z.infer<typeof PlaceStatus>;

export const Vote = z.enum(['want', 'maybe', 'wont']);
export type Vote = z.infer<typeof Vote>;

const createPlaceSchema = () =>
  z.object({
    address: Address.optional(),
    cost: z.number().optional(),
    createdAt: z.string(),
    datetime: z.string().optional(),
    endDatetime: z.string().optional(),
    id: z.string(),
    name: z.string(),
    notes: z.string().optional(),
    phoneNumber: z.string().optional(),
    // Missing status on older docs means "planned".
    status: PlaceStatus.optional(),
    tripId: z.string().optional(),
    updatedAt: z.string(),
    userId: z.string(),
    // Keyed by traveler id.
    votes: z.record(z.string(), Vote).optional(),
    website: z.string().optional(),
  });

export const Activity = createPlaceSchema();
export type Activity = z.infer<typeof Activity>;
export const NewActivity = Activity.omit({ id: true });
export type NewActivity = z.infer<typeof NewActivity>;

export const Entertainment = createPlaceSchema();
export type Entertainment = z.infer<typeof Entertainment>;
export const NewEntertainment = Entertainment.omit({ id: true });
export type NewEntertainment = z.infer<typeof NewEntertainment>;

export const Food = createPlaceSchema();
export type Food = z.infer<typeof Food>;
export const NewFood = Food.omit({ id: true });
export type NewFood = z.infer<typeof NewFood>;

export const Shopping = createPlaceSchema();
export type Shopping = z.infer<typeof Shopping>;
export const NewShopping = Shopping.omit({ id: true });
export type NewShopping = z.infer<typeof NewShopping>;

export const FlightETA = z.object({
  airportCode: z.string(),
  airportName: z.string().optional(),
  city: z.string(),
  country: z.string(),
  datetime: z.string(),
  seatType: z.string().optional(),
  state: z.string().optional(),
  terminal: z.string().optional(),
  timezone: z.string(),
});

export type FlightETA = z.infer<typeof FlightETA>;

export const Flight = z.object({
  airline: z.string(),
  arrival: FlightETA,
  confirmationNumber: z.string().optional(),
  createdAt: z.string(),
  departure: FlightETA,
  duration: z.number().optional(),
  flightNumber: z.string(),
  id: z.string(),
  layoverFlightIds: z.array(z.string()).optional(),
  notes: z.string().optional(),
  tripId: z.string().optional(),
  updatedAt: z.string(),
  userId: z.string(),
  website: z.string().optional(),
});

export type Flight = z.infer<typeof Flight>;
export const NewFlight = Flight.omit({ id: true });
export type NewFlight = z.infer<typeof NewFlight>;

export const Lodging = z.object({
  address: Address.optional(),
  bookingUrl: z.string().optional(),
  checkInDatetime: z.string().optional(),
  checkOutDatetime: z.string().optional(),
  confirmationNumber: z.string().optional(),
  createdAt: z.string(),
  id: z.string(),
  name: z.string(),
  notes: z.string().optional(),
  phoneNumber: z.string().optional(),
  tripId: z.string().optional(),
  updatedAt: z.string(),
  userId: z.string(),
  website: z.string().optional(),
});

export type Lodging = z.infer<typeof Lodging>;
export const NewLodging = Lodging.omit({ id: true });
export type NewLodging = z.infer<typeof NewLodging>;

export const Transport = z.object({
  arrivalDatetime: z.string().optional(),
  confirmationNumber: z.string().optional(),
  createdAt: z.string(),
  departureDatetime: z.string().optional(),
  dropoffLocation: Address.optional(),
  id: z.string(),
  name: z.string(),
  notes: z.string().optional(),
  pickupLocation: Address.optional(),
  phoneNumber: z.string().optional(),
  tripId: z.string().optional(),
  updatedAt: z.string(),
  userId: z.string(),
  website: z.string().optional(),
});

export type Transport = z.infer<typeof Transport>;
export const NewTransport = Transport.omit({ id: true });
export type NewTransport = z.infer<typeof NewTransport>;
