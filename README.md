# Dinver Explorer

Dinver Explorer je mobilna aplikacija izrađena pomoću React Native i Expo-a. Aplikacija omogućuje korisnicima pregled restorana, pretragu, prijavu/registraciju te upravljanje korisničkim profilom. Također podržava tamni način rada i integraciju s Google prijavom.

## Funkcionalnosti

### 1. **Prijava i Registracija**
- Korisnici se mogu prijaviti ili registrirati putem emaila i lozinke.
- Podržana je validacija unosa (provjera formata emaila i minimalne duljine lozinke).
- Prijava putem Google računa pomoću Firebase autentifikacije.

### 2. **Automatska prijava**
- Ako korisnik ima spremljeni token, aplikacija automatski prijavljuje korisnika prilikom pokretanja.

### 3. **Pregled restorana**
- Korisnici mogu pregledavati popis restorana s detaljima poput imena, ocjene, broja recenzija i statusa (otvoreno/zatvoreno).
- Podržana je funkcionalnost "sviđanja" restorana.

### 4. **Pretraga restorana**
- Korisnici mogu pretraživati restorane prema ključnim riječima.
- Ako nema rezultata pretrage, prikazuje se poruka "No results found."

### 5. **Tamni način rada**
- Aplikacija podržava tamni način rada koji se može uključiti/isključiti putem prekidača.

### 6. **Upravljanje korisničkim profilom**
- Korisnici mogu pregledavati svoje podatke i odjaviti se iz aplikacije.

### 7. **Skeleton loaderi**
- Prikazuju se skeleton loaderi dok se podaci o restoranima učitavaju.

### 8. **Promjena adrese**
- Korisnici mogu unijeti i spremiti novu adresu putem modalnog prozora.

---

## Struktura projekta

### `src/context`
- **`AuthContext.tsx`**: Upravljanje autentifikacijom korisnika (prijava, odjava, automatska prijava).
- **`ThemeContext.tsx`**: Upravljanje temom aplikacije (tamni i svijetli način rada).

### `src/screens`
- **`HomeScreen.tsx`**: Početni ekran aplikacije koji prikazuje osnovne informacije.
- **`ExploreScreen.tsx`**: Ekran za pregled i pretragu restorana.
- **`ProfileScreen.tsx`**: Ekran za prijavu, registraciju i upravljanje korisničkim profilom.

### `src/components`
- **`SkeletonCard.tsx`**: Skeleton loader za prikaz dok se podaci o restoranima učitavaju.
- **`RestaurantCard.tsx`**: Komponenta za prikaz pojedinačnog restorana s detaljima.

### `src/services`
- **`authService.ts`**: API pozivi za prijavu i registraciju korisnika.
- **`firebaseConfig.ts`**: Konfiguracija Firebase-a za Google prijavu.

---

## Autor
Aplikaciju je izradio **Toni Jelavić**.
