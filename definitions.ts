export type Length = number & { readonly Length: unique symbol };
export type Time = number & { readonly Time: unique symbol };
export type Mass = number & { readonly Length: unique symbol };
export type Speed = number & { readonly Speed: unique symbol };
export type Acceleration = number & { readonly Acceleration: unique symbol };

export type Coord3D<T> = [T, T, T];
export type Coord2D<T> = [T, T];

export type Body = {
	mass: Mass;
	color?: [number, number, number];
	position: Coord2D<Length>;
	acceleration: Coord2D<Acceleration>;
};
