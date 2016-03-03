/**
 * Created by SNKraynov on 26.11.2015.
 */
CONST = {
    CAN_READ:0x000,             // Просматривать
    CAN_EDIT_TITLE:0x001,       // Редактировать заголовок
    CAN_EDIT_DESCRIPTION:0x002, // Редактировать описание
    CAN_CHANGE_DATE:0x004,      // Изменить срок
    CAN_PERFORM_TASK:0x008,     // Выполнить задачу
    CAN_DELETE_TASK:0x010,      // Удалить задачу
    CAN_CREATE_SUBTASK:0x020,   // Создать подзадачу
    CAN_SET_PERFORMER:0x040,    // Назначить исполнителя
    CAN_MOVE_TASK:0x080,        // Переместить задачу
    CAN_COMMENT:0x100,          // Комментировать
    CAN_SHARE:0x200,            // Поделиться
    CAN_REGULAR_TASK:0x400,     // Регулярная задача
    CAN_ALL:0xFFF,              // Все права

    ROLE_AUTHOR:0x001,          // Автор
    ROLE_PERFORMER:0x002,       // Исполнитель
    ROLE_READER:0x004,          // Читатель (для расшаренных задач)
    ROLE_EDITOR:0x008,          // Редактор (для расшаренных задач)
    ROLE_NEW_TASK:0x010,        // Псевдороль для папки "Новые задачи"

    // Флаги настроек панелей
    LEARNING_ON_DOWN :0x01,     // Панель снизу
    LEARNING_ON_RIGHT:0x02,     // Панель справа
    LEARNING_ON_LEFT :0x04,     // Панель слева
    LEARNING_IS_FIXED:0x10,     // Панель фиксирована на экране

    // Периодичность вызова функций проверки наличия/отсутствия на экране интерфейсных элементов
    LEARNING_PERIOD:5000        // 5 сек = 5000 мс

};
