document.addEventListener("DOMContentLoaded", () => {
    const roleForms = document.querySelectorAll("roleForm");

    roleForms.forEach(form => {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const userId = form.querySelector("input[name='userId']").value;
            const role = form.querySelector("select[name='role']").value;

            fetch('/api/users/update-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, role })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Rol actualizado exitosamente');
                    } else {
                        alert('Error al acatualizar rol');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al acatualizar rol');
                });
        });
    });
    // Eliminar usuario
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();

            const userId = button.getAttribute("id");

            fetch(`/api/users/:id`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Usuario eliminado exitosamente');
                        // Eliminar la fila de la tabla
                        button.closest('tr').remove();
                    } else {
                        alert('Error al eliminar usuario');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al eliminar usuario');
                });
        });
    })
})