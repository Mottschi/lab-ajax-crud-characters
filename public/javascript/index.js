  /**
   * You might want to use this template to display each new characters
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template#examples
   */
  const characterTemplate = document.getElementById('template');
  const baseUrl = '/api/characters';
  const charactersContainer = document.querySelector('.characters-container');
  const characterSearchIdInput = document.querySelector('.operation > label[for="character-id"]+input');
  const characterDeleteIdInput = document.querySelector('input[name="character-id-delete"]');

  const newCharNameInput = document.querySelector('#new-character-form input[name="name"]');
  const newCharWeaponInput = document.querySelector('#new-character-form input[name="weapon"]');
  const newCharOccupationInput = document.querySelector('#new-character-form input[name="occupation"]');
  const newCharCartoonInput = document.querySelector('#new-character-form input[name="cartoon"]');

  const editCharIdInput = document.querySelector('#edit-character-form input[name="chr-id"]');
  const editCharNameInput = document.querySelector('#edit-character-form input[name="name"]');
  const editCharWeaponInput = document.querySelector('#edit-character-form input[name="weapon"]');
  const editCharOccupationInput = document.querySelector('#edit-character-form input[name="occupation"]');
  const editCharCartoonInput = document.querySelector('#edit-character-form input[name="cartoon"]');

  document.getElementById('fetch-all').addEventListener('click', fetchAllCharacters);

  async function fetchAllCharacters (event) {
    try {
      const {data:characters} = await axios.get(baseUrl);
      charactersContainer.innerHTML = '';
    
      for (const character of characters) {
        createCharacter(character);
      }
    } catch (error) {
      console.log(error)
    }
  }

  document.getElementById('fetch-one').addEventListener('click', async function (event) {
    try {
      const id = characterSearchIdInput.value;
      const {data: character} = await axios.get(`${baseUrl}/${id}`);

      charactersContainer.innerHTML = '';
      if (character) createCharacter(character);
    } catch (error) {
      console.log(error);
    }
  });

  document.getElementById('delete-one').addEventListener('click', async function (event) {
    try {
      const id = characterDeleteIdInput.value;
      if (!id.length) return;
      const {data: responseMessage} = await axios.delete(`${baseUrl}/${id}`);
      if (responseMessage === 'Character has been successfully deleted') {
        event.target.style.backgroundColor = "green";
        characterDeleteIdInput.value = '';
        await fetchAllCharacters();
      } else {
        event.target.style.backgroundColor = "red";
      }
    } catch (error) {
      console.log(error)
    }
  });

  document.getElementById('edit-character-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
      const id = editCharIdInput.value;
      const name = editCharNameInput.value;
      const occupation = editCharOccupationInput.value;
      const weapon = editCharWeaponInput.value;
      const cartoon = editCharCartoonInput.checked;

      const updatedValues = {};

      console.log(cartoon, updatedValues)

      if (name.length) updatedValues.name = name;
      if (occupation.length) updatedValues.occupation = occupation;
      if (weapon.length) updatedValues.weapon = weapon;
      if (cartoon !== undefined) updatedValues.cartoon = cartoon;

      const {data} = await axios.patch(`${baseUrl}/${id}`, updatedValues);

      if (data !== 'Character not found') {
        event.target.querySelector('button').style.backgroundColor = 'green';
        await fetchAllCharacters();
      } else {
        event.target.querySelector('button').style.backgroundColor = 'red';
      }

    } catch (error) {
      console.log(error)
    }
  });

  document.getElementById('new-character-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    try {
      const name = newCharNameInput.value;
      const occupation = newCharOccupationInput.value;
      const weapon = newCharWeaponInput.value;
      const cartoon = newCharCartoonInput.checked;

      const {status, data: character} = await axios.post(baseUrl, {name, occupation, cartoon, weapon});
      if (status === 201) {
        event.target.querySelector('button').style.backgroundColor = 'green';
        createCharacter(character)
      } else {
        event.target.querySelector('button').style.backgroundColor = 'red';
      }
    } catch (error) {
      
    }
  });

function createCharacter(character) {
  const clone = characterTemplate.content.cloneNode(true);
  clone.querySelector('.character-id > span').textContent = character._id;
  clone.querySelector('.name > span').textContent = character.name;
  clone.querySelector('.occupation > span').textContent = character.occupation;
  clone.querySelector('.cartoon > span').textContent = character.cartoon;
  clone.querySelector('.weapon > span').textContent = character.weapon;
  charactersContainer.appendChild(clone);
}