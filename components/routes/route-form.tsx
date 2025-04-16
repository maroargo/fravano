"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { routeSchema, type RouteSchema } from "@/lib/zod";
import useSWR from "swr";
import {
  Patient,
  RouteAsign,
  RoutePreference,
  RoutePriority,
  RouteType,
  Type,
} from "@prisma/client";
import { IDriver } from "@/interfaces/driver";
import { CirclePlus, Trash2 } from "lucide-react";
import { DateTimePicker } from "../ui/datetimepicker";
import { PlaceAutocomplete } from "../ui/place-autocomplete";
import { useCallback, useEffect, useState } from "react";
import { IRouteDetail } from "@/interfaces/route";
import { useToast } from "@/hooks/use-toast";
import { IVehicle } from "@/interfaces/vehicle";
import { IPharmacy } from "@/interfaces/pharmacy";

interface RouteFormProps {
  defaultValues: RouteSchema;
  onSubmit: (data: RouteSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isDisabled: boolean;
  setFields: (fields: IRouteDetail[]) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const calculateTravelTime = async (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          if (
            result &&
            result.routes.length > 0 &&
            result.routes[0].legs.length > 0
          ) {
            const duration = result.routes[0].legs[0].duration;
            resolve(duration?.value ?? 0); // Handle possibly undefined duration
          } else {
            reject(`Directions request failed due to ${status}`);
          }
        } else {
          reject(`Directions request failed due to ${status}`);
        }
      }
    );
  });
};

export default function RouteForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isDisabled,
  setFields,
}: RouteFormProps) {
  const form = useForm<RouteSchema>({
    resolver: zodResolver(routeSchema),
    defaultValues,
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "routeDetails",
    control: form.control,
  });
  const { toast } = useToast();

  const { data: drivers } = useSWR<IDriver[]>("/api/drivers/active", fetcher);
  const { data: vehicles } = useSWR<IVehicle[]>(
    "/api/vehicles/active",
    fetcher
  );

  const { data: patients } = useSWR<Patient[]>("/api/patients/active", fetcher);
  const { data: pharmacys } = useSWR<IPharmacy[]>("/api/pharmacys", fetcher);

  const { data: routeAsign } = useSWR<RouteAsign[]>("/api/routeAsign", fetcher);

  const { data: routeType } = useSWR<RouteType[]>("/api/routeType", fetcher);

  const { data: type } = useSWR<Type[]>("/api/types", fetcher);

  const { data: prioritys } = useSWR<RoutePriority[]>("/api/routePriority", fetcher);

  const { data: routePreference } = useSWR<RoutePreference[]>("/api/routePreference", fetcher);

  const driverList = drivers || [];
  const vehicleList = vehicles || [];
  const patientList = patients || [];
  const pharmacyList = pharmacys || [];
  const routeAsignList = routeAsign || [];
  const routeTypeList = routeType || [];
  const prioritytList = prioritys || [];
  const typeList = type || [];
  const routePreferenceList = routePreference || [];

  const handlePlaceSelect = useCallback(
    async (place: google.maps.places.PlaceResult, index: number) => {
      if (place?.geometry?.location) {
        const location = place.geometry.location;
        const updatedRouteDetails = form.getValues().routeDetails; // Make a copy of fields
        updatedRouteDetails[index] = {
          ...updatedRouteDetails[index],
          address: place.formatted_address || "",
          lat: location.lat(),
          lng: location.lng(),
        };

        // Update the field value directly in useFieldArray
        update(index, updatedRouteDetails[index]);

        if (index > 0) {
          const previousLat = updatedRouteDetails[index - 1].lat;
          const previousLng = updatedRouteDetails[index - 1].lng;
          const currentLat = location.lat();
          const currentLng = location.lng();

          if (
            previousLat !== undefined &&
            previousLng !== undefined &&
            currentLat !== undefined &&
            currentLng !== undefined
          ) {
            const previousLocation: google.maps.LatLngLiteral = {
              lat: previousLat,
              lng: previousLng,
            };
            const currentLocation: google.maps.LatLngLiteral = {
              lat: currentLat,
              lng: currentLng,
            };

            try {
              const travelTimeInSeconds = await calculateTravelTime(
                previousLocation,
                currentLocation
              );

              const previousDeparture =
                updatedRouteDetails[index - 1].estimation;
              const previousDepartureTime = previousDeparture
                ? new Date(previousDeparture).getTime()
                : Date.now();

              const arrivalTime = new Date(
                previousDepartureTime + travelTimeInSeconds * 1000
              );

              updatedRouteDetails[index].estimation = new Date(
                arrivalTime.toISOString()
              );

              update(index, updatedRouteDetails[index]);
            } catch (error) {
              console.log(error);
              toast({
                title: "Error",
                description: "The route does not exist",
              });
            }
          } else {
            toast({
              title: "Error",
              description: "Invalid lat/lng value",
            });
          }
        }
      }
    },
    [fields, update] // Include fields as dependency
  );

  //Radio Buttons
  const [assign, setAssign] = useState("1");

  const handleAssign = (value: any) => {
    const parsedObject = JSON.parse(value);
    setAssign(parsedObject.value);
    form.setValue("idRouteAsign", parsedObject.id);
  };

  const [typeRoute, setTypeRoute] = useState("1");

  const handleTypeRoute = (value: any) => {
    const parsedObject = JSON.parse(value);
    setTypeRoute(parsedObject.value);
    form.setValue("idType", parsedObject.id);
  };

  useEffect(() => {
    setFields(fields as unknown as IRouteDetail[]);
  }, [fields]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <FormField
            disabled={isDisabled}
            control={form.control}
            name="idRoutePreference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preference Route</FormLabel>
                <Select
                  disabled={isDisabled}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a route preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {routePreferenceList.map((pref) => (
                      <SelectItem key={pref.id} value={pref.id}>
                        {pref.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {isDisabled && (
            <FormField
              disabled={isDisabled}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!isDisabled && (
            <FormField
              control={form.control}
              name="idRouteAsign"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Assign Route to</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={handleAssign}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1"
                    >
                      {routeAsignList.map((routeAsign) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={routeAsign.id}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={JSON.stringify(routeAsign)}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {routeAsign.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {assign == "1" && (
            <FormField
              disabled={isDisabled}
              control={form.control}
              name="idDriver"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Driver</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {driverList.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.user?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {assign == "2" && (
            <FormField
              disabled={isDisabled}
              control={form.control}
              name="idDriver"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Vehicle</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleList.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.driver?.id}>
                          {vehicle.name} ({vehicle.label})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <FormField
              disabled={isDisabled}
              control={form.control}
              name="idRoutePriority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Priority</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {prioritytList.map((priority) => (
                        <SelectItem key={priority.id} value={priority.id}>
                          {priority.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isDisabled}
              control={form.control}
              name="idRouteType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Type</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a route type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {routeTypeList.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isDisabled && (
            <FormField
              control={form.control}
              name="idType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={handleTypeRoute}
                      defaultValue={field.value}
                      className="flex flex-row space-y-1"
                    >
                      {typeList.map((t) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={t.id}
                        >
                          <FormControl>
                            <RadioGroupItem value={JSON.stringify(t)} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {typeRoute == "1" && (
            <FormField
              disabled={isDisabled}
              control={form.control}
              name="idPatient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Patient</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patientList.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name} (ID: {patient.patientId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {typeRoute == "2" && (
            <FormField
              disabled={isDisabled}
              control={form.control}
              name="idPatient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Pharmacy</FormLabel>
                  <Select
                    disabled={isDisabled}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pharmacy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pharmacyList.map((pharmacy) => (
                        <SelectItem
                          key={pharmacy.id}
                          value={pharmacy.patient?.id}
                        >
                          {pharmacy.order} (ID: {pharmacy.patient?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end gap-5">
          {!isDisabled && (
            <Button
              type="button"
              onClick={() => {
                if (fields.length >= 1) {
                  const updatedRouteDetails = form.getValues().routeDetails; // Get a copy of the current route details
                  const detailSize = updatedRouteDetails.length;

                  // Update the second to last item after the new stop is appended
                  updatedRouteDetails[detailSize - 1].item = String(
                    detailSize - 1
                  );

                  // Update the route details with the modified second to last item
                  update(detailSize - 1, updatedRouteDetails[detailSize - 1]);
                }
                // Only append the new field after a slight delay
                append({
                  item: "END",
                  address: "",
                  estimation: null,
                  notes: "",
                });
              }}
            >
              <CirclePlus />
            </Button>
          )}
        </div>

        <Separator className="my-4" />

        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex justify-between items-end mb-4 min-w-full gap-5">
              <div className="w-[40px] flex justify-between items-end">
                <FormField
                  disabled={isDisabled}
                  control={form.control}
                  name={`routeDetails.${index}.item`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{field.value}</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  disabled={isDisabled}
                  control={form.control}
                  name={`routeDetails.${index}.address`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <PlaceAutocomplete
                          {...field}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            field.onChange(e.target.value);
                          }}
                          disabled={isDisabled}
                          placeholder={"Address"}
                          value={field.value}
                          onPlaceSelect={(place) => {
                            if (place) {
                              handlePlaceSelect(place, index);
                            }
                          }}
                          className="z-[100001]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  disabled={isDisabled}
                  name={`routeDetails.${index}.estimation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimation Time</FormLabel>
                      <FormControl>
                        <DateTimePicker {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  disabled={isDisabled}
                  name={`routeDetails.${index}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isDisabled && (
                <Button
                  disabled={isDisabled}
                  type="button"
                  onClick={() => remove(index)}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          </div>
        ))}

        {!isDisabled && (
          <Button
            disabled={isSubmitting}
            className="w-full relative"
            type="submit"
          >
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-md">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {submitButtonText}
          </Button>
        )}
      </form>
    </Form>
  );
}
