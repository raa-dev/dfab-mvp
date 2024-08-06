import { atom } from "jotai";
import { Address } from "viem";

export const accountDisplayNameAtom = atom<string | null>(null);

export const accountAddressAtom = atom<Address | null>(null);
