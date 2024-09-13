COMPONENTS_BASE = '''
Аватар
import { Avatar } from '@nlmk/ds-2.0';

export default App = () => (
  <>
    <Avatar />
  </>
)

Аватар с именем Антон и фамилией Валуев
import { Avatar } from '@nlmk/ds-2.0';

export default App = () => (
  <>
    <Avatar userName='Антон' userSurname='Валуев' />
  </>
)


Кнопка с текстом Button
import { Button } from '@nlmk/ds-2.0';

export default  App = () =>(
  <>
  <Button>
    Button
  </>
)


Заголовок для "Заголовок по умолчанию"
import { Header } from '@nlmk/ds-2.0';

export default  App = () => (
  <Header title="Заголовок по умолчанию" />
)


Input с подписью Label
import { Input } from '@nlmk/ds-2.0';

export default App = () => (
  <>
    <Input label="Label" />
  </>
);


Вставка изображения по ссылке 'https://images.unsplash.com/photo-1683343946402-85b144e8ecb6?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

import { ImagePicture } from '@nlmk/ds-2.0';

const App = () => {
  const path = 'https://images.unsplash.com/photo-1683343946402-85b144e8ecb6?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <ImagePicture src={path} alt="Описание изображения" />
  )
};

export default App;

Ссылка для сайта "https://www.w3schools.com/
 import { Link } from '@nlmk/ds-2.0';

const App = () => (
  <Link href="https://www.w3schools.com/">Ссылка</Link>
);

export default App;

Прикрепить файл
import { File } from '@nlmk/ds-2.0';

export default  App = () => (
  <>
    <File label="File (по умолчанию)" />
  </>
)

Прогресс бар с 50% прогресса и подписью “Прогресс”
import { ProgressBar } from '@nlmk/ds-2.0';

export default  App = () => (
  <div style={{ width: '400px', marginTop: '50px' }}>
    <ProgressBar percentage={50} label="Прогресс" />
  </div>
);

Кнопка с группами сегментов Печенье, Торты
import { SegmentButtonGroup } from '@nlmk/ds-2.0';

const { Button } = SegmentButtonGroup;

export default App = () => {
  return (
    <SegmentButtonGroup>
      <Button onClick={() => console.log(new Date())}>
        Печенье
      </Button>
      <Button onClick={() => console.log(new Date())}>
        Торты
      </Button>
    </SegmentButtonGroup>
  )
}

Выбор одного объекта из списка apple, banana, cherry

 import { Select } from '@nlmk/ds-2.0';
  import { useState } from 'react';

const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry'}
  ];

export default  App = () => {
  const [selected, setSelected] = useState([]);
  return (
    <>
      <Select
        options={options}
        label="Одиночный выбор"
        selected={selected}
        onSelectionChange={setSelected}
      />
    </>
  )
};

Множественный выбор объектов из списка apple, banana, cherry
import { Select } from '@nlmk/ds-2.0';
  import { useState } from 'react';

const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry'},
  ];

export default  App = () => {
  const [selected, setSelected] = useState([]);
  return (
    <>
      <Select
        options={options}
        label="Множественный выбор"
        multiple
        selected={selected}
        onSelectionChange={setSelected}
      />
    </>
  )
};

Snackbar
import { Snackbar } from '@nlmk/ds-2.0';

export default App = () => (
  <Snackbar> Snackbar по умолчанию </Snackbar>
)

Добавить Tabs “Входящие”, "Мои папки", “Спам”, “Черновики”
import { Tabs, Typography, Box } from '@nlmk/ds-2.0';
import { useState } from 'react';

export default  App = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Tabs>
        <Tabs.Tab
          label="Входящие"
          active={0 === Number(activeTab)}
          onClick={() => setActiveTab(0)}
        />
        <Tabs.Tab
          label="Мои папки"
          active={1 === Number(activeTab)}
          onClick={() => setActiveTab(1)}
        />
        <Tabs.Tab
          label="Спам"
          active={2 === Number(activeTab)}
          onClick={() => setActiveTab(2)}
          badgeNumber="91"
        >
         <Tabs.Tab
          label="Черновики"
          active={3 === Number(activeTab)}
          onClick={() => setActiveTab(3)}
          badgeNumber="2"
        />
      </Tabs>

      <Box width={350}>
        {Number(activeTab) == 0 && (
          <Typography variant="Heading4" color="var(--steel-90)">
            Входящие
          </Typography>
        )}
        {Number(activeTab) == 1 && (
          <Typography variant="Heading4" color="var(--steel-90)">
            Мои папки
          </Typography>
        )}
        {Number(activeTab) == 2 && (
          <Typography variant="Heading4" color="var(--steel-90)">
            Папка с спамом
          </Typography>
        )}
        {Number(activeTab) == 3 && (
          <Typography variant="Heading4" color="var(--steel-90)">
            Черновики
          </Typography>
        )}
      </Box>
    </>
  )
}

'''