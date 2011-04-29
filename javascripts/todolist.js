/**
 * todoList @ djalmaaraujo [at] jquerybr
 *
 * Dependencies; 
 *	- jquery library
 *	- jquery.Storage plugin
 *
 */
$(function() {
	todoContainer		= $('#todolist');
	todoInput				= todoContainer.find('.header input');
	todoPlaceHolder = 'Digite uma tarefa e aperte enter..';
	todoStorageKey	= 'todolistDB';
	
	TodoList = {
		handlers: function() {
			
			// Input handler
			todoInput.keydown(function(event) {
				if (event.keyCode == 13 && event.shiftKey == 0) {
					TodoList.insert(function() {
						TodoList.loadTasks();
					});
					todoInput.val('');
					return false;
				}
			});
			
			// Remove task
			todoContainer.find('ul li a.mark-as-done').live('click', function() {
				var id = $(this).data('id');
				TodoList.delete(id, function() {
					TodoList.loadTasks();
				});
			});
		},
		
		// Retrieve tasks from localStorage
		tasks: function() {
			return $.Storage.loadItem(todoStorageKey);
		},
		
		// Insert a task into localStorage
		insert: function(fn) {
			var message = todoInput.val();
			if ((message != '') && (message != todoPlaceHolder)) {
				var tasks = TodoList.tasks();
				if (!tasks) tasks = [];
				tasks.push({id: tasks.length+1, message: message});
				TodoList.save(tasks);
			}
			if (fn) fn();
		},
		
		// Delete a task from localStorage
		delete: function(id, fn) {
			var tasks			= TodoList.tasks();
			var newTasks	= [];
			if (tasks) {
				for (var i = 0; i < tasks.length; i++) {
					if (tasks[i].id != id) {
						newTasks.push(tasks[i]);
					}
				}
				console.log(newTasks);
				TodoList.save(newTasks);
			}
			if (fn) fn();
		},
		
		// Sage tasks into localStorage
		save: function(tasks) {
			$.Storage.saveItem(todoStorageKey, tasks);
		},
		
		// Retrieve tasks from localStorage and append them to html
		loadTasks: function() {
			todoContainer.find('ul').html('');
			var tasks = TodoList.tasks();
			if (tasks) {
				for (var i = 0; i < tasks.length; i++) {
					TodoList.appendTask(tasks[i]);
				}
			}
		},
		
		// Append to html a new task
		appendTask: function(task) {
			html = '';
			html += '<li>';
			html += ' <a href="javascript:void(0);" data-id="' + task.id + '" class="mark-as-done">[Done]</a> ';
			html += ' <span class="task">';
			html += task.message;
			html +=	 '	</span>';
			html +=	 '</li>';
			todoContainer.find('ul').append(html);
		}
	};
	
	// Start up
	TodoList.handlers();
	TodoList.loadTasks();
});