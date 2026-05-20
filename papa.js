(function () {
    'use strict';

    var pluginName = 'Папа';

    // Главный компонент плагина
    function PapaComponent(object) {
        var network = new Lampa.Reguest();
        var scroll = new Lampa.Scroll({ mask: true, over: true, step: 250 });
        var html = $('<div></div>');
        
        // UI элементы: Поиск и фильтры
        var searchField = $('<div class="search-box selector" style="padding: 1em; background: rgba(255,255,255,0.1); margin-bottom: 1em; text-align: center; border-radius: 5px;">Поиск (Нажмите для ввода)</div>');
        var filterBox = $('<div class="filter-box selector" style="padding: 1em; background: rgba(255,255,255,0.1); margin-bottom: 1em; text-align: center; border-radius: 5px;">Категории</div>');
        var contentGrid = $('<div class="papa-grid" style="display: flex; flex-wrap: wrap; gap: 10px; padding: 10px;"></div>');

        this.create = function () {
            this.activity.loader(true);
            this.loadData();
        };

        this.loadData = function () {
            // Место для вашего парсера. 
            // Пример использования network.silent для получения HTML:
            /*
            var targetUrl = 'https://.../categories';
            network.silent(targetUrl, function (htmlString) {
                var parser = new DOMParser();
                var doc = parser.parseFromString(htmlString, 'text/html');
                // Извлечение категорий: var categories = doc.querySelectorAll('.category-item');
                this.build();
            }.bind(this), function(a, c) {
                Lampa.Noty.show('Ошибка загрузки данных');
                this.build();
            }.bind(this));
            */
            
            // Для тестов вызываем отрисовку с задержкой
            setTimeout(this.build.bind(this), 500);
        };

        this.build = function () {
            this.activity.loader(false);
            
            html.append(searchField);
            html.append(filterBox);
            html.append(contentGrid);
            
            // Логика поля поиска
            searchField.on('hover:enter', function() {
                Lampa.Input.edit({
                    title: 'Поиск по базе Папа',
                    value: '',
                    free: true,
                    nosave: true
                }, function (new_value) {
                    Lampa.Noty.show('Ищем: ' + new_value);
                    // Здесь вызываем загрузку данных с параметром search=new_value
                });
            });

            // Логика выпадающего меню категорий
            filterBox.on('hover:enter', function() {
                var items = [
                    { title: 'Категория 1', url: '/cat1' },
                    { title: 'Категория 2', url: '/cat2' },
                    { title: 'Сбросить фильтр', url: 'reset' }
                ];
                
                Lampa.Select.show({
                    title: 'Выберите категорию',
                    items: items,
                    onSelect: function (a) {
                        Lampa.Noty.show('Выбрана категория: ' + a.title);
                        // Очищаем contentGrid и загружаем новые данные по a.url
                    },
                    onBack: function () {
                        Lampa.Controller.toggle('content');
                    }
                });
            });

            scroll.append(html);
            this.render().append(scroll.render());
        };

        this.start = function () {
            Lampa.Controller.add('content', {
                toggle: function () {
                    Lampa.Controller.collectionSet(html);
                    Lampa.Controller.collectionFocus(html.find('.selector').eq(0), html);
                },
                left: function () {
                    Lampa.Controller.toggle('menu');
                },
                up: function () {
                    return false;
                },
                down: function () {
                    return false;
                }
            });
            Lampa.Controller.toggle('content');
        };

        this.pause = function () {};
        this.stop = function () {};
        this.render = function () { return html; };
        this.destroy = function () {
            network.clear();
            scroll.destroy();
            html.remove();
        };
    }

    // Регистрируем компонент в системе Lampa
    Lampa.Component.add('papa_component', PapaComponent);

    // Добавляем пункт в боковое меню при инициализации приложения
    Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
            // Иконка (простой круг для примера, можно заменить на любую SVG)
            var icon = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4Z"/></svg>';
            var menuItem = $('<li class="menu__item selector"><div class="menu__ico">' + icon + '</div><div class="menu__text">' + pluginName + '</div></li>');

            menuItem.on('hover:enter', function () {
                Lampa.Activity.push({
                    url: '',
                    title: pluginName,
                    component: 'papa_component',
                    page: 1
                });
            });

            $('.menu .menu__list').eq(0).append(menuItem);
        }
    });

})();
