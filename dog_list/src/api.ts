export const fetchImages = async (breed:string) => {
    const replaced_breed = breed.replace(/-/g, '/');
    const response = await fetch(
        `https://dog.ceo/api/breed/${replaced_breed}/images/random/12`
    );

    const data = await response.json();
    
    return (data.status == "success") ? data.message : [];
}